param([Parameter(Mandatory)][string]$Consumer, [string]$CertificateSubject = 'CN=ui')
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
Add-Type -AssemblyName UIAutomationClient,UIAutomationTypes
$Consumer = (Resolve-Path $Consumer).Path
$resultPath = Join-Path $Consumer 'result.json'
$identity = 'org.octane.masoncorequalification'
$projectName = (Split-Path $Consumer -Leaf) -replace '[^a-zA-Z0-9]', ''
if ((Get-Process -Id $PID).SessionId -eq 0) { throw 'MSIX installation and OS input require an interactive user session, not sshd session 0. Use invoke-session.ps1.' }
Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class MasonInput {
  [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X; public int Y; }
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetPhysicalCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern bool GetPhysicalCursorPos(ref POINT p);
  [DllImport("user32.dll")] public static extern uint GetDpiForWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern void mouse_event(uint flags, uint x, uint y, int data, UIntPtr extra);
  [DllImport("user32.dll")] public static extern IntPtr OpenInputDesktop(uint flags, bool inherit, uint access);
  [DllImport("user32.dll")] public static extern bool SwitchDesktop(IntPtr desktop);
  [DllImport("user32.dll")] public static extern bool CloseDesktop(IntPtr desktop);
}
'@
$msix = Get-ChildItem (Join-Path $Consumer 'platforms\windows') -Recurse -Filter '*.msix' | Where-Object { $_.Name -eq ($projectName + '_1.0.0.0_x64.msix') } | Select-Object -First 1
if (-not $msix) { throw 'Build consumer with pnpm exec ns build windows --release first.' }
$sign = Get-ChildItem "$env:USERPROFILE\.nuget\packages\microsoft.windows.sdk.buildtools\*\bin\*\x64\signtool.exe" | Select-Object -First 1 -ExpandProperty FullName
$cert = Get-ChildItem Cert:\CurrentUser\My | Where-Object Subject -eq $CertificateSubject | Select-Object -First 1
if (-not $cert) { $cert = Get-ChildItem Cert:\LocalMachine\My | Where-Object Subject -eq $CertificateSubject | Select-Object -First 1 }
if (-not $cert) { throw "Install an authorized trusted signing certificate matching $CertificateSubject before running this fixture." }
& $sign sign /fd SHA256 /sha1 $cert.Thumbprint $msix.FullName
if ($LASTEXITCODE -ne 0) { throw "MSIX signing failed: $LASTEXITCODE" }
# Only this fixture identity is replaced. Do not register a loose manifest: its framework graph is incomplete.
Get-AppxPackage $identity | Remove-AppxPackage
$dependencies = @(Get-ChildItem (Join-Path $msix.DirectoryName 'Dependencies\x64') -Filter '*.msix' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName)
if ($dependencies.Count) { Add-AppxPackage -Path $msix.FullName -DependencyPath $dependencies } else { Add-AppxPackage -Path $msix.FullName }
$package = Get-AppxPackage $identity
if (-not $package) { throw 'Fixture MSIX installation did not produce the expected identity.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($msix.FullName)
$payload = @()
try {
  foreach ($name in @('app/bundle.mjs','app/vendor.mjs','NativeScript.Mason.dll','dotnet-bridge/DotNetBridge.dll')) {
    $entry = $zip.GetEntry($name)
    if (-not $entry) { throw "MSIX is missing required payload $name." }
    $stream = $entry.Open()
    $hash = [System.Security.Cryptography.SHA256]::Create()
    try { $expected = [BitConverter]::ToString($hash.ComputeHash($stream)).Replace('-', '') }
    finally { $stream.Dispose(); $hash.Dispose() }
    $actual = (Get-FileHash (Join-Path $package.InstallLocation $name) -Algorithm SHA256).Hash
    if ($actual -ne $expected) { throw "Installed payload differs from the built MSIX: $name." }
    $payload += @{ name = $name; sha256 = $actual.ToLowerInvariant() }
  }
} finally { $zip.Dispose() }
@{ package = $package.PackageFullName; msixSha256 = (Get-FileHash $msix.FullName).Hash.ToLowerInvariant(); files = $payload } | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $Consumer 'installation.json')
Remove-Item $resultPath, (Join-Path $Consumer 'input-actions.json') -ErrorAction SilentlyContinue
# Launch the registered package executable with redirected handles so startup
# failures remain inspectable even before JavaScript can write result.json.
Start-Process -FilePath (Join-Path $package.InstallLocation ($projectName + '.exe')) -RedirectStandardOutput (Join-Path $Consumer 'runtime.log') -RedirectStandardError (Join-Path $Consumer 'runtime.err')
$deadline = (Get-Date).AddSeconds(60)
$injected = $false
try {
  while ((Get-Date) -lt $deadline) {
    $runtimeError = Join-Path $Consumer 'runtime.err'
    if (Test-Path $runtimeError) {
      $startup = Get-Content -Raw $runtimeError
      if ($startup -match 'Uncaught error evaluating module') { throw "Fixture startup failed: $startup" }
    }
    if (Test-Path $resultPath) {
      try { $r = Get-Content -Raw $resultPath | ConvertFrom-Json } catch { Start-Sleep -Milliseconds 50; continue }
      if ($r.phase -eq 'awaiting-os-input' -and -not $injected) {
        $desktop = [MasonInput]::OpenInputDesktop(0, $false, 0x100)
        if ($desktop -eq [IntPtr]::Zero -or -not [MasonInput]::SwitchDesktop($desktop)) { throw 'Interactive input desktop unavailable or locked; cannot qualify OS input from this session.' }
        [MasonInput]::CloseDesktop($desktop) | Out-Null
        $process = Get-Process $projectName | Select-Object -First 1
        # UI Automation supplies physical screen bounds from the owning HWND's
        # provider. A managed peer alone may omit its desktop-window origin.
        $condition = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ProcessIdProperty, [int]$process.Id)
        $windows = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $condition)
        $viewport = $null
        $h = [IntPtr]::Zero
        foreach ($window in $windows) {
          $elements = $window.FindAll([System.Windows.Automation.TreeScope]::Descendants, [System.Windows.Automation.Condition]::TrueCondition)
          foreach ($element in $elements) {
            $pattern = $null
            if (-not $element.TryGetCurrentPattern([System.Windows.Automation.ScrollPattern]::Pattern, [ref]$pattern)) { continue }
            if (-not $pattern.Current.VerticallyScrollable) { continue }
            $rect = $element.Current.BoundingRectangle
            $wantedView = 100 * $r.measurements.scroll.viewport.height / ($r.measurements.scroll.extent + $r.measurements.scroll.viewport.height)
            if ([Math]::Abs($pattern.Current.VerticalViewSize - $wantedView) -gt 1) { continue }
            $viewport = $rect
            $h = [IntPtr]$window.Current.NativeWindowHandle
            break
          }
          if ($viewport) { break }
        }
        if (-not $viewport -or $h -eq [IntPtr]::Zero) { throw 'The fixture scroll viewport is unavailable through the owning window UI Automation provider; OS input cannot be targeted reliably.' }
        if (-not [MasonInput]::SetForegroundWindow($h)) { throw 'Windows denied foreground activation; OS input cannot be targeted reliably.' }
        Start-Sleep -Milliseconds 150
        $scale = [MasonInput]::GetDpiForWindow($h) / 96.0
        $p = New-Object MasonInput+POINT
        $p.X = [int]($viewport.X + $viewport.Width * 0.16)
        $p.Y = [int]($viewport.Y + $viewport.Height * 0.20)
        if (-not [MasonInput]::SetPhysicalCursorPos($p.X, $p.Y)) { throw 'Physical cursor positioning failed on the input desktop.' }
        $actual = New-Object MasonInput+POINT
        if (-not [MasonInput]::GetPhysicalCursorPos([ref]$actual) -or $actual.X -ne $p.X -or $actual.Y -ne $p.Y) { throw 'The input desktop did not retain the requested physical cursor position.' }
        [MasonInput]::mouse_event(0x02, 0, 0, 0, [UIntPtr]::Zero)
        [MasonInput]::mouse_event(0x04, 0, 0, 0, [UIntPtr]::Zero)
        Start-Sleep -Milliseconds 100
        [MasonInput]::mouse_event(0x0800, 0, 0, -240, [UIntPtr]::Zero)
        @{ session = (Get-Process -Id $PID).SessionId; method = 'UI Automation physical bounds; user32 mouse_event click and wheel'; x = $p.X; y = $p.Y; dpiScale = $scale; screenViewport = @{ x = $viewport.X; y = $viewport.Y; width = $viewport.Width; height = $viewport.Height }; windowHandle = $h.ToInt64(); wheelDelta = -240 } | ConvertTo-Json | Set-Content (Join-Path $Consumer 'input-actions.json')
        $injected = $true
      }
      if ($r.phase -in @('failed','complete')) {
        Get-Content -Raw $resultPath
        if (-not $r.success) { throw 'Windows consumer assertions failed; see result.json.' }
        Get-FileHash $msix.FullName -Algorithm SHA256
        exit 0
      }
    }
    Start-Sleep -Milliseconds 100
  }
  throw 'Windows consumer timed out; inspect result.json for the last assertion/input stage.'
} finally {
  Get-Process $projectName -ErrorAction SilentlyContinue | Stop-Process
}

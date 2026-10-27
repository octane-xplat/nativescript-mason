$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot '..\..'
$patch = Join-Path $root 'packages\nativescript-mason-core\platforms\windows\patch-winrt-projection.ps1'
$temp = Join-Path ([System.IO.Path]::GetTempPath()) ('mason-projection-test-' + [guid]::NewGuid())
New-Item -ItemType Directory $temp | Out-Null
try {
  $source = @'
public partial class View : global::Microsoft.UI.Xaml.Controls.Panel, IEquatable<View>
{
    Node IMasonElement.Node { get; }
    Style IMasonElement.Style { get; }
    Node IMasonContainer.Node { get; }
}
public partial class Already : IEquatable<Already>, IMasonElement
{
    Node IMasonElement.Node { get; }
}
public static class Helpers
{
    Node IMasonElement.Node { get; }
}
'@
  $file = Join-Path $temp 'NativeScript.Mason.cs'
  Set-Content -LiteralPath $file -Value $source
  & $patch -Dir $temp
  $patched = Get-Content -Raw $file
  if ($patched -notmatch 'IEquatable<View>, IMasonContainer, IMasonElement') { throw 'Projection repair omitted required explicit interfaces.' }
  if ($patched -notmatch 'IEquatable<Already>, IMasonElement\s*\{') { throw 'Projection repair duplicated an existing interface.' }
  if ($patched -notmatch 'public static class Helpers\s*\{') { throw 'Projection repair changed the static helper.' }
  $hash = (Get-FileHash $file).Hash
  & $patch -Dir $temp
  if ((Get-FileHash $file).Hash -ne $hash) { throw 'Projection repair is not idempotent.' }
  'Windows projection prerequisite regression passed.'
  $bridge = Join-Path $temp 'dotnet-bridge\publish'
  New-Item -ItemType Directory $bridge | Out-Null
  Set-Content (Join-Path $bridge 'DotNetBridge.dll') 'fixture'
  Set-Content (Join-Path $bridge 'DotNetBridge.runtimeconfig.json') '{}'
  Set-Content (Join-Path $temp 'asset.png') 'fixture'
  $targets = Join-Path $root 'packages\nativescript-mason-core\platforms\windows\plugin.targets'
  $project = Join-Path $temp 'content.proj'
  @"
<Project>
  <PropertyGroup><NSWindowsRoot>$temp</NSWindowsRoot></PropertyGroup>
  <ItemGroup><Content Include="$temp\asset.png"><Link>assets\asset.png</Link></Content></ItemGroup>
  <Target Name="PublishDotNetBridge" />
  <Import Project="$targets" />
</Project>
"@ | Set-Content $project
  $output = & dotnet msbuild $project -nologo -t:AddDotNetBridgeContent -getItem:Content
  if ($LASTEXITCODE -ne 0) { throw 'Bridge content target failed.' }
  $items = ($output -join "`n" | ConvertFrom-Json).Items.Content
  if ($items.Count -ne 3) { throw "Expected asset and two bridge files, got $($items.Count)." }
  $links = @($items | ForEach-Object Link | Sort-Object)
  $expected = @('assets\asset.png','dotnet-bridge\DotNetBridge.dll','dotnet-bridge\DotNetBridge.runtimeconfig.json') | Sort-Object
  if (@(Compare-Object $links $expected).Count) { throw "Bridge content paths are incorrect: $links" }
  'Windows MSIX bridge content regression passed.' 
} finally { Remove-Item -Recurse -Force $temp }

param([Parameter(Mandatory)][string]$Consumer, [int]$TimeoutSeconds = 120)
$ErrorActionPreference = 'Stop'
$Consumer = (Resolve-Path $Consumer).Path
$log = Join-Path $Consumer 'interactive.log'
$exitFile = Join-Path $Consumer 'interactive.exit'
$runner = Join-Path $Consumer 'interactive-task.ps1'
$task = 'MasonCoreQualification' + [guid]::NewGuid().ToString('N')
$runLiteral = (Join-Path $PSScriptRoot 'run.ps1').Replace("'", "''")
$consumerLiteral = $Consumer.Replace("'", "''")
$logLiteral = $log.Replace("'", "''")
$exitLiteral = $exitFile.Replace("'", "''")
# Separate process contains run.ps1's exit; finally always writes the task result.
@"
`$ErrorActionPreference = 'Stop'
try {
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File '$runLiteral' -Consumer '$consumerLiteral' *> '$logLiteral'
  `$code = `$LASTEXITCODE
} catch { `$_ | Out-File '$logLiteral' -Append; `$code = 1 }
Set-Content '$exitLiteral' `$code
"@ | Set-Content -Encoding UTF8 $runner
Remove-Item $exitFile -ErrorAction SilentlyContinue
try {
  & schtasks /create /tn $task /tr "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$runner`"" /sc once /st 00:00 /it /f | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Could not create interactive session task.' }
  & schtasks /run /tn $task | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Could not start interactive session task.' }
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while (-not (Test-Path $exitFile)) {
    if ((Get-Date) -gt $deadline) { throw 'Session task timed out; verify the user is logged in and desktop unlocked.' }
    Start-Sleep -Milliseconds 250
  }
  Get-Content $log
  exit [int](Get-Content $exitFile)
} finally {
  & schtasks /end /tn $task 2>$null | Out-Null
  & schtasks /delete /tn $task /f | Out-Null
  Remove-Item $runner -ErrorAction SilentlyContinue
}

param([Parameter(Mandatory)][string]$Dir)
# CsWinRT emits explicit interface members (e.g. `Node IImage.Node`) for
# NativeScript.Mason.winmd's overridable interfaces but omits the interface from
# the class's interface list -> CS0540. Append each missing IFace to the
# enclosing class declaration. Only runtimeclass projections are patched —
# identified by IEquatable<T> in the base list; static helper classes are
# skipped.
$ErrorActionPreference = 'Stop'
$patched = 0
foreach ($file in (Get-ChildItem -Path $Dir -Filter '*.cs' -ErrorAction SilentlyContinue)) {
	$lines = [System.Collections.Generic.List[string]]::new()
	$lines.AddRange([string[]](Get-Content -LiteralPath $file.FullName))
	$toAdd = @{}
	$classDecl = -1
	for ($i = 0; $i -lt $lines.Count; $i++) {
		$line = $lines[$i]
		if ($line -match '^\s*(?:public|internal)\s+(?:sealed\s+|static\s+|abstract\s+|partial\s+)*class\s+\w+') {
			$classDecl = $i; continue
		}
		if ($classDecl -lt 0) { continue }
		if ($line -match '^\s*\S+\s+(I[A-Z]\w*)\.(\w+)[\s({=]') {
			$iface = $Matches[1]
			# gather the class declaration text through its opening brace
			$j = $classDecl
			$declText = ''
			while ($j -lt $lines.Count -and $lines[$j] -notmatch '\{') { $declText += $lines[$j]; $j++ }
			if ($j -ge $lines.Count) { continue }
			$declText += ($lines[$j] -split '\{')[0]
			# only runtimeclass projections carry IEquatable<T>
			if ($declText -notmatch 'IEquatable<') { continue }
			if ($declText -match "\b$([regex]::Escape($iface))\b") { continue }
			if (-not $toAdd.ContainsKey($classDecl)) { $toAdd[$classDecl] = [System.Collections.Generic.List[string]]::new() }
			if (-not $toAdd[$classDecl].Contains($iface)) { $toAdd[$classDecl].Add($iface) }
		}
	}
	foreach ($declIdx in $toAdd.Keys) {
		$ifaces = ', ' + (($toAdd[$declIdx] | Sort-Object -Unique) -join ', ')
		$j = $declIdx
		while ($lines[$j] -notmatch '\{') { $j++ }
		if ($lines[$j].Trim() -eq '{') {
			$lines[$j - 1] = $lines[$j - 1].TrimEnd() + $ifaces
		} else {
			$lines[$j] = [regex]::Replace($lines[$j], '\{', ($ifaces + ' {'), 1)
		}
		$patched++
	}
	if ($toAdd.Count -gt 0) { [System.IO.File]::WriteAllLines($file.FullName, $lines) }
}
"patch-winrt-projection: appended missing interfaces to $patched class declarations"

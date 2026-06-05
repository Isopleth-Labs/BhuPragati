param(
  [string[]]$Patterns = @('earth-day.jpg','earth-night.jpg','earth-clouds.png','earth-topology.png','earth-water.png','earth-day-topo.jpg','earth-hero.png')
)

foreach ($pattern in $Patterns) {
  $escaped = [regex]::Escape($pattern)
  $matchResults = Get-ChildItem -Path src -Recurse -File | Select-String -Pattern $escaped
  if ($matchResults) {
    Write-Output "Pattern: $pattern"
    foreach ($match in $matchResults) {
      Write-Output "  $($match.Path):$($match.LineNumber): $($match.Line.Trim())"
    }
  } else {
    Write-Output "Pattern: $pattern -> no references"
  }
}

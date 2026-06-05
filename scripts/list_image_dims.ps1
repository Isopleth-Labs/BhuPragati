Add-Type -AssemblyName System.Drawing
Get-ChildItem -Path public -File | ForEach-Object {
  if ($_.Extension -match '\.(png|jpg|jpeg|webp)$') {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    Write-Output ("{0}|{1}|{2}" -f $_.Name, $img.Width, $img.Height)
    $img.Dispose()
  }
}

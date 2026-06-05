Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\Amit4\Pictures\Screenshots\Screenshot 2026-06-04 170923.png')
$bmp = New-Object System.Drawing.Bitmap($img)

Write-Host "=== IMAGE INFO ==="
Write-Host "Size: $($img.Width) x $($img.Height)"

# Sample key regions: center (globe), top-center (title), bottom-center (CTA)
$regions = @{
    "Center (globe)" = @{ X = [int]($img.Width/2); Y = [int]($img.Height*0.42) }
    "Top-Center (title)" = @{ X = [int]($img.Width/2); Y = [int]($img.Height*0.25) }
    "Bottom-Center (CTA)" = @{ X = [int]($img.Width/2); Y = [int]($img.Height*0.78) }
    "Left panel area" = @{ X = [int]($img.Width*0.12); Y = [int]($img.Height*0.45) }
    "Right panel area" = @{ X = [int]($img.Width*0.88); Y = [int]($img.Height*0.45) }
}

foreach ($key in $regions.Keys) {
    $r = $regions[$key]
    $pixel = $bmp.GetPixel($r.X, $r.Y)
    Write-Host "$key at ($($r.X),$($r.Y)): R=$($pixel.R) G=$($pixel.G) B=$($pixel.B) Hex=#$($pixel.R.ToString('X2'))$($pixel.G.ToString('X2'))$($pixel.B.ToString('X2'))"
}

# Get average colors in a few horizontal scanlines
$scanY = [int]($img.Height * 0.42)
$leftEdge = [int]($img.Width * 0.05)
$rightEdge = [int]($img.Width * 0.95)
Write-Host "`n=== SCANLINE at Y=$scanY (globe row) ==="
for ($x = $leftEdge; $x -le $rightEdge; $x += 50) {
    $p = $bmp.GetPixel($x, $scanY)
    if ($p.R -lt 30 -and $p.G -lt 30 -and $p.B -lt 30) {
        Write-Host "  X=$x : DARK (space/background)"
    } elseif ($p.B -gt $p.R -and $p.B -gt $p.G -and $p.B -gt 100) {
        Write-Host "  X=$x : BLUE TONE R=$($p.R) G=$($p.G) B=$($p.B) (earth/ocean)"
    } elseif ($p.R -gt 150 -and $p.G -gt 120 -and $p.B -lt 100) {
        Write-Host "  X=$x : WARM TONE R=$($p.R) G=$($p.G) B=$($p.B) (land/india)"
    } else {
        Write-Host "  X=$x : R=$($p.R) G=$($p.G) B=$($p.B)"
    }
}

$bmp.Dispose()
$img.Dispose()
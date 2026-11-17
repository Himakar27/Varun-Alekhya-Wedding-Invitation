Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\USER\.gemini\antigravity\brain\2130e4d8-cf13-43d0-b05b-3e4ce5e17228\.user_uploaded\media_1794678485036_63faee55.jpg"
$outDir = "d:\per proj\Varun_&_Alekhya's_Wedding\assets\images\timeline"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$items = @(
    @{ Id=1; Name="event_1_pellikoduku"; X1=120; Y1=0; X2=334; Y2=227 },
    @{ Id=2; Name="event_2_pellikuthuru"; X1=408; Y1=5; X2=598; Y2=227 },
    @{ Id=3; Name="event_3_mehandi"; X1=654; Y1=0; X2=996; Y2=227 },
    @{ Id=4; Name="event_4_haldi"; X1=22; Y1=228; X2=354; Y2=454 },
    @{ Id=5; Name="event_5_sangeet"; X1=365; Y1=228; X2=681; Y2=454 },
    @{ Id=6; Name="event_6_kalagorulu"; X1=671; Y1=228; X2=1018; Y2=454 },
    @{ Id=7; Name="event_7_reception"; X1=12; Y1=455; X2=340; Y2=681 },
    @{ Id=8; Name="event_8_pelli"; X1=353; Y1=455; X2=675; Y2=681 },
    @{ Id=9; Name="event_9_satyanarayana_vratham"; X1=675; Y1=455; X2=1012; Y2=681 }
)

foreach ($item in $items) {
    $cropW = $item.X2 - $item.X1 + 1
    $cropH = $item.Y2 - $item.Y1 + 1
    
    $outBmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    # Copy pixels
    for ($y = 0; $y -lt $cropH; $y++) {
        for ($x = 0; $x -lt $cropW; $x++) {
            $p = $bmp.GetPixel($item.X1 + $x, $item.Y1 + $y)
            $outBmp.SetPixel($x, $y, $p)
        }
    }
    
    # Flood-fill transparency from borders:
    # A pixel is considered background if max(R,G,B) <= 12
    $visited = New-Object 'bool[,]' $cropW, $cropH
    $queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]
    
    # Add border pixels that are dark
    for ($x = 0; $x -lt $cropW; $x++) {
        $pTop = $outBmp.GetPixel($x, 0)
        $maxT = [Math]::Max($pTop.R, [Math]::Max($pTop.G, $pTop.B))
        if ($maxT -le 15) {
            $queue.Enqueue((New-Object System.Drawing.Point($x, 0)))
            $visited[$x, 0] = $true
        }
        $pBot = $outBmp.GetPixel($x, $cropH - 1)
        $maxB = [Math]::Max($pBot.R, [Math]::Max($pBot.G, $pBot.B))
        if ($maxB -le 15) {
            $queue.Enqueue((New-Object System.Drawing.Point($x, $cropH - 1)))
            $visited[$x, $cropH - 1] = $true
        }
    }
    for ($y = 0; $y -lt $cropH; $y++) {
        $pLeft = $outBmp.GetPixel(0, $y)
        $maxL = [Math]::Max($pLeft.R, [Math]::Max($pLeft.G, $pLeft.B))
        if ($maxL -le 15 -and !$visited[0, $y]) {
            $queue.Enqueue((New-Object System.Drawing.Point(0, $y)))
            $visited[0, $y] = $true
        }
        $pRight = $outBmp.GetPixel($cropW - 1, $y)
        $maxR = [Math]::Max($pRight.R, [Math]::Max($pRight.G, $pRight.B))
        if ($maxR -le 15 -and !$visited[$cropW - 1, $y]) {
            $queue.Enqueue((New-Object System.Drawing.Point($cropW - 1, $y)))
            $visited[$cropW - 1, $y] = $true
        }
    }
    
    # BFS
    while ($queue.Count -gt 0) {
        $pt = $queue.Dequeue()
        $px = $pt.X
        $py = $pt.Y
        
        # Make transparent
        $outBmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        
        # Check 4 neighbors
        $neighbors = @(
            (New-Object System.Drawing.Point($px + 1, $py)),
            (New-Object System.Drawing.Point($px - 1, $py)),
            (New-Object System.Drawing.Point($px, $py + 1)),
            (New-Object System.Drawing.Point($px, $py - 1))
        )
        foreach ($n in $neighbors) {
            if ($n.X -ge 0 -and $n.X -lt $cropW -and $n.Y -ge 0 -and $n.Y -lt $cropH) {
                if (!$visited[$n.X, $n.Y]) {
                    $visited[$n.X, $n.Y] = $true
                    $np = $outBmp.GetPixel($n.X, $n.Y)
                    $maxN = [Math]::Max($np.R, [Math]::Max($np.G, $np.B))
                    if ($maxN -le 15) {
                        $queue.Enqueue($n)
                    }
                }
            }
        }
    }
    
    # Save PNG
    $dest = Join-Path $outDir ($item.Name + ".png")
    $outBmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()
    Write-Host ("Exported " + $item.Name + " (" + $cropW + "x" + $cropH + ") to " + $dest)
}

$bmp.Dispose()
Write-Host "All 9 event icons successfully generated!"

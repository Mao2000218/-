$repoDir = Split-Path -Parent $PSScriptRoot
$updateDir = Join-Path $repoDir "update"
$distDir = Join-Path $repoDir "dist"

New-Item -ItemType Directory -Force -Path $updateDir | Out-Null

# Create update.zip from dist
Compress-Archive -Path "$distDir\*" -DestinationPath "$updateDir\update.zip" -Force

$size = (Get-Item "$updateDir\update.zip").Length
$buildTime = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

$json = "{`"version`":`"v26.5.3`",`"buildTime`":`"$buildTime`",`"url`":`"update.zip`",`"size`":$size}"
[System.IO.File]::WriteAllText("$updateDir\version.json", $json, [System.Text.Encoding]::UTF8)

Write-Host "OTA package created in update/:"
Write-Host $json
Write-Host "update.zip: $size bytes"
Write-Host ""
Write-Host "Next: git add update/ && git commit -m 'OTA update' && git push"

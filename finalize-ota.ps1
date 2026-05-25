$repoDir = Split-Path -Parent $PSScriptRoot
$updateDir = Join-Path $repoDir "update"
$zipFile = Join-Path $updateDir "update.zip"

if (-not (Test-Path $zipFile)) {
    Write-Host "ERROR: update.zip not found at $zipFile"
    Write-Host "Run package-ota.ps1 first to build the zip."
    exit 1
}

$size = (Get-Item $zipFile).Length
$buildTime = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

$json = "{`"version`":`"v26.5.3`",`"buildTime`":`"$buildTime`",`"url`":`"update.zip`",`"size`":$size}"
[System.IO.File]::WriteAllText("$updateDir\version.json", $json, [System.Text.Encoding]::UTF8)

Write-Host "version.json updated:"
Write-Host $json
Write-Host ""
Write-Host "Next: git add update/ && git commit -m 'OTA update' && git push"

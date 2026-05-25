$env:JAVA_HOME = 'D:\android-sdk\jdk21\jdk-21.0.11+10'
$env:ANDROID_HOME = 'D:\android-sdk'
$env:ANDROID_SDK_ROOT = 'D:\android-sdk'
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Set-Location $PSScriptRoot
./gradlew.bat --stop 2>&1 | Out-Null
./gradlew.bat assembleDebug --max-workers=1 2>&1
Write-Host "BUILD_EXIT_CODE: $LASTEXITCODE"

# Copy APK if successful
if ($LASTEXITCODE -eq 0) {
    $apk = Get-ChildItem -Path "app\build\outputs\apk\debug" -Filter "*.apk" | Select-Object -First 1
    if ($apk) {
        New-Item -ItemType Directory -Force -Path "D:\前端\app" | Out-Null
        Copy-Item $apk.FullName "D:\前端\app\fittrack.apk" -Force
        Write-Host "APK copied to D:\前端\app\fittrack.apk ($([math]::Round($apk.Length/1MB, 2)) MB)"
    }
}

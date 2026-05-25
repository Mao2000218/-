@echo off
chcp 65001 >nul
set "JAVA_HOME=D:\android-sdk\jdk\jdk-17.0.19+10"
set "ANDROID_SDK_ROOT=D:\android-sdk"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "D:\前端\fitness-app\android"

echo Building APK...
call gradlew.bat assembleDebug 2>&1

echo.
echo Copying APK to output...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    copy /Y "app\build\outputs\apk\debug\app-debug.apk" "D:\前端\app\fittrack.apk"
    echo APK copied successfully!
    dir "D:\前端\app\"
) else (
    echo APK NOT FOUND! Build may have failed.
)
exit /b 0

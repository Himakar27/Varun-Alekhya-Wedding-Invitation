@echo off
title Varun & Alekhya's Wedding Invitation
cd /d "%~dp0"

:: 1. Try launching with Google Chrome with Autoplay Policy Unlocked
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --autoplay-policy=no-user-gesture-required "%~dp0index.html"
    exit /b
)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --autoplay-policy=no-user-gesture-required "%~dp0index.html"
    exit /b
)
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" --autoplay-policy=no-user-gesture-required "%~dp0index.html"
    exit /b
)

:: 2. Try launching with Microsoft Edge with Autoplay Policy Unlocked
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --autoplay-policy=no-user-gesture-required "%~dp0index.html"
    exit /b
)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --autoplay-policy=no-user-gesture-required "%~dp0index.html"
    exit /b
)

:: 3. Fallback to default browser
start "" "%~dp0index.html"
exit /b

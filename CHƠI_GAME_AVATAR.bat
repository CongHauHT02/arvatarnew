@echo off
title Avatar 2D - Launcher PC
cd /d "%~dp0"
echo =======================================================
echo          AVATAR 2D - CHAY GAME TREN MAY TINH
echo =======================================================
echo Dang khoi dong Avatar 2.5.8...
start "" "C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot\bin\java.exe" -jar microemulator-2.0.4\microemulator.jar Avatar258.jar
exit

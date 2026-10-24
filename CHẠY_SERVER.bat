@echo off
title Avatar 2D - Server Manager
echo =======================================================
echo          AVATAR 2D - KHOI DONG SERVER TOAN BO
echo =======================================================

echo 1. Kiem tra va khoi dong MariaDB...
start "" "C:\Program Files\MariaDB 13.0\bin\mysqld.exe" --defaults-file="C:\Program Files\MariaDB 13.0\data\my.ini" --console
timeout /t 2 >nul

echo 2. Khoi dong Game Server Java (Port 19128)...
start "" "C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot\bin\java.exe" -jar target\Avatar2D-1.0-SNAPSHOT.jar
timeout /t 3 >nul

echo 3. Khoi dong WebSocket Proxy (Port 19129)...
start "" "C:\Program Files\nodejsnvm\node.exe" ws-proxy.js

echo =======================================================
echo SERVER DA KHOI DONG HOAN TAT!
echo Port 14444: Game Client (Xu So Dieu Ky)
echo Port 19128: Game Server TCP (Xu So Than Tien)
echo Port 19129: WebSocket Proxy
echo Port 3306 : Database MariaDB
echo =======================================================
pause

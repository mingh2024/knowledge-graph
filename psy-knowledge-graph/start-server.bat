@echo off
chcp 65001 >nul
pushd "%~dp0"
node server.cjs
popd
echo.
pause >nul

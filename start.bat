@echo off
chcp 65001 >nul
title Рыбка от Светланы — магазин
cd /d "%~dp0"

rem Node.js установлен для пользователя и может не быть в PATH
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%ProgramFiles%\nodejs;%PATH%"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js не найден. Установите его с https://nodejs.org ^(версия LTS^) и запустите этот файл снова.
  pause
  exit /b 1
)

rem Уже запущен? Второй экземпляр нельзя: локальная база рассчитана на один процесс
netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
if not errorlevel 1 (
  echo Магазин уже запущен: http://localhost:3000
  if not defined NO_BROWSER start "" http://localhost:3000
  timeout /t 3 >nul
  exit /b 0
)

if not exist node_modules (
  echo Первый запуск: устанавливаю зависимости, это займёт пару минут...
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)

echo.
echo   Витрина:  http://localhost:3000
echo   Админка:  http://localhost:3000/admin   ^(admin / ryba2026^)
echo   Остановить — закрыть это окно или нажать Ctrl+C
echo.

rem Открываем браузер, когда сервер успеет стартовать
if not defined NO_BROWSER start "" cmd /c "timeout /t 8 >nul & start "" http://localhost:3000"
call npm run dev
pause

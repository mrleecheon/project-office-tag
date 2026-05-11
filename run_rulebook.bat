@echo off
setlocal
cd /d "%~dp0"
python build_unexist_rulebook.py
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] PDF 생성에 실패했습니다.
  pause
  exit /b %errorlevel%
)
echo.
echo [OK] PDF 생성 완료: unexist_rulebook_v03.pdf
start "" "%~dp0unexist_rulebook_v03.pdf"
exit /b 0

set pwd=%cd%\
start "" _bundle_core ghostkube

ping 127.0.0.1 -n 5 >nul

cd %pwd%
deno run --allow-read --allow-write remove_export_statements.ts ..\..\dist\ghostkube.js

:: cd %pwd%..\
:: start "" compressJs.bat

ping 127.0.0.1 -n 3 >nul
cd %pwd%..\..\
xcopy /y dist\*.js test\js\
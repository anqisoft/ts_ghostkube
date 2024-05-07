@ECHO OFF
if "%1%" == "" exit

set deno_json_path=%cd%\..\..\deno.json
set ts_file_name=%1%
cd ..\..\src\

deno bundle -c %deno_json_path% --no-check %ts_file_name%.ts ..\dist\%ts_file_name%.js || pause
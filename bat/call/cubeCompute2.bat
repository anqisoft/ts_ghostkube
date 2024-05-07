goto main

:comments
:: call %bat_call_cubeCompute2% dataFlag=%1 subCatalogName2=%2 jsPath=%3 vCubeCompute2=%4
:: call %bat_call_cubeCompute2% dataFlag=rows_2 subCatalogName2=not_extend_1_to_24 jsPath= vCubeCompute2=v0.0.1

call %bat_call_cubeCompute2% rows_2 test only_rows_2

:main
@echo off

set dataPath=P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\!important\data\
set mannerDetailsFullFilename=%dataPath%mannerDetails.ts
if not exist %mannerDetailsFullFilename% (
  echo [Error] %mannerDetailsFullFilename% not exists!
  pause && exit
)

::cls
::echo call cubeCompute2.bat %1 %2 %3 %4

set dataFlag=%1
set subCatalogName2=%2
set jsPath=%3
set vCubeCompute2=%4

if not "%dataFlag%"=="" (
  set dataFlag=%dataFlag:"=%
)
if not "%subCatalogName2%"=="" (
  set subCatalogName2=%subCatalogName2:"=%
)
::echo dataFlag=%dataFlag% subCatalogName2=%subCatalogName2%
if not "%jsPath%"=="" (
  set jsPath=%jsPath:"=%
)
::echo jsPath=%jsPath% vCubeCompute2=%vCubeCompute2% ~%vCubeCompute2%~
if not "%vCubeCompute2%"=="" (
  set vCubeCompute2=%vCubeCompute2:"=%
)

if "%dataFlag%"=="" (set dataFlag=rows_2)
if "%subCatalogName2%"=="" (set subCatalogName2=not_extend_1_to_24)
if not "%jsPath%"=="" (set jsPath=%jsPath%\)
set jsPath=%jsPath: =%
if "%vCubeCompute2%"=="" (set vCubeCompute2=v0.0.1)

::echo dataFlag=%dataFlag% jsPath=%jsPath% subCatalogName2=%subCatalogName2% vCubeCompute2=%vCubeCompute2%
::title call cubeCompute2.bat %dataFlag% %jsPath% %subCatalogName2% %vCubeCompute2%
::pause
::exit

title call cubeCompute2.bat %dataFlag% %jsPath% %subCatalogName2% %vCubeCompute2%

set sourcePath=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

set goalPath=%dataPath%%dataFlag%_%subCatalogName1%\
if not exist %goalPath% (md %goalPath%)

set workPath2=P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\cubeCompute2\%vCubeCompute2%\%dataFlag%\%subCatalogName2%\
set goalJsFullPathName2=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\data\%jsPath%simple_manner_details.js
set tempJsFullPathName=%dataPath%mannerDetails.js
set logNewName2=log_cubeCompute2.txt

if not exist %workPath2% (md %workPath2%)
cd /d %workPath2%
copy /y %sourcePath%cubeCore.ts cubeCore.ts
copy /y %sourcePath%cubeCompute2.ts cubeCompute2.ts
if exist log.txt (del /q log.txt)

deno run --v8-flags=--max-old-space-size=20480 -A cubeCompute2.ts

copy /y *.* %goalPath%
if exist %goalPath%%logNewName2% (del /q %goalPath%%logNewName2%)
ren %goalPath%log.txt %logNewName2%
move /y P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\!important\data\simple_manner*.*  %goalPath%
copy /y %goalPath%simple_manner_details.js %goalJsFullPathName2%
del /q %tempJsFullPathName%
cd ..

7z a -p%sevenZipDefaultPassword% -t7z %dataPath%cubeCompute2_%vCubeCompute2%_%subCatalogName2%.7z %workPath2%*.*

echo %goalJsFullPathName2%
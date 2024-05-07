goto main

:comments
:: call %bat_call_cubeCompute1% dataFlag=%1 subCatalogName1=%2 vCubeCompute1=%3
:: call %bat_call_cubeCompute1% dataFlag=rows_2 subCatalogName1=not_extend_1_to_24 vCubeCompute1=v0.0.4

call %bat_call_cubeCompute1% rows_2 test

call %bat_call_cubeCompute1% rows_2_3 full

:main
@echo off
cls

set dataFlag=%1
set subCatalogName1=%2
set vCubeCompute1=%3

if not "%dataFlag%"=="" (
  set dataFlag=%dataFlag:"=%
)
if not "%subCatalogName1%"=="" (
  set subCatalogName1=%subCatalogName1:"=%
)
if not "%vCubeCompute1%"=="" (
  set vCubeCompute1=%vCubeCompute1:"=%
)

if "%dataFlag%"=="" (set dataFlag=rows_2)
if "%subCatalogName1%"=="" (set subCatalogName1=not_extend_1_to_24)
if "%vCubeCompute1%"=="" (set vCubeCompute1=v0.0.4)

::@echo dataFlag=%dataFlag% subCatalogName1=%subCatalogName1% vCubeCompute1=%vCubeCompute1%
::@title call cubeCompute1.bat %dataFlag% %subCatalogName1% %vCubeCompute1%
::pause
::exit

title call cubeCompute1.bat %dataFlag% %subCatalogName1% %vCubeCompute1%

set sourcePath=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\
set dataPath=P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\!important\data\
set goalPath=%dataPath%%dataFlag%_%subCatalogName1%\
set workPath1=P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\cubeCompute1\%vCubeCompute1%\%dataFlag%\%subCatalogName1%\
set logNewName=log_cubeCompute1.txt
set mannerDetailsFullFilename=%dataPath%mannerDetails.ts

if not exist %goalPath% (md %goalPath%)
if not exist %workPath1% (md %workPath1%)
cd /d %workPath1%
copy /y %sourcePath%cubeCore.ts cubeCore.ts
copy /y %sourcePath%cubeCompute1.ts cubeCompute1.ts
if exist log.txt (del /q log.txt)

deno run --v8-flags=--max-old-space-size=20480 -A cubeCompute1.ts
copy /y mannerDetails.ts %mannerDetailsFullFilename%
copy /y *.* %goalPath%
if exist %goalPath%%logNewName% (del /q %goalPath%%logNewName%)
ren %goalPath%log.txt %logNewName%

cd ..

7z a -p%sevenZipDefaultPassword% -t7z %dataPath%cubeCompute1_%vCubeCompute1%_%subCatalogName1%.7z %workPath1%*.*

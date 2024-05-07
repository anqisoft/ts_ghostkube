::echo call %%bat_call_cubeCompute2%% "%1" "%4" "%3" "%6"
::pause && exit

goto main

:comments
:: call %bat_call_cubeCompute1_and_cubeCompute2% dataFlag=%1 subCatalogName1=%2 jsPath=%3 subCatalogName2=%4 vCubeCompute1=%5 vCubeCompute2=%6
dataFlag: rows_2
subCatalogName1: not_extend_1_to_24
jsPath:

:main
@echo off

set subCatalogName2=%4
if not "%subCatalogName2%"=="" (
  set subCatalogName2=%subCatalogName2:"=%
)
if "%subCatalogName2%"=="" (set subCatalogName2=%2)
if not "%subCatalogName2%"=="" (
  set subCatalogName2=%subCatalogName2:"=%
)

call %bat_call_cubeCompute1% "%1" "%2" "%5"
call %bat_call_cubeCompute2% "%1" "%subCatalogName2%" "%3" "%6"
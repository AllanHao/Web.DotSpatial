@echo off
set dir_Path=%~dp0%
set builder_path=%dir_Path%Net.Code.Generator.Win.exe
set meta_path=%dir_Path%..\MetaData
set runtime_path=%dir_Path%..\Runtime
set app_path=%dir_Path%..\ApplicationLib
set script_path=%dir_Path%..\Script
set code_path=%dir_Path%..\Code
set msbuild=C:\Windows\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe
echo 开始编译   店铺实体组件
call %builder_path% /c %meta_path%\店铺实体组件.be
call %msbuild% %code_path%\IWEHAVE.ERP.StoreBE\IWEHAVE.ERP.StoreBE.sln /p:Configuration=Release

echo 开始编译   店铺服务组件
call %builder_path% /c %meta_path%\店铺服务组件.bp
call %msbuild% %code_path%\IWEHAVE.ERP.StoreBP\IWEHAVE.ERP.StoreBP.sln /p:Configuration=Release

echo 开始编译   报表实体组件
call %builder_path% /c %meta_path%\报表实体组件.be
call %msbuild% %code_path%\IWEHAVE.ERP.ChartsBE\IWEHAVE.ERP.ChartsBE.sln /p:Configuration=Release

echo 开始编译   报表服务组件
call %builder_path% /c %meta_path%\报表服务组件.bp
call %msbuild% %code_path%\IWEHAVE.ERP.ChartsBP\IWEHAVE.ERP.ChartsBP.sln /p:Configuration=Release

echo 开始编译   附加业务实体
call %builder_path% /c %meta_path%\附加业务实体.be
call %msbuild% %code_path%\IWEHAVE.ERP.ExpandBE\IWEHAVE.ERP.ExpandBE.sln /p:Configuration=Release

echo 开始编译   附加业务服务
call %builder_path% /c %meta_path%\附加业务服务.bp
call %msbuild% %code_path%\IWEHAVE.ERP.ExpandBP\IWEHAVE.ERP.ExpandBP.sln /p:Configuration=Release

echo 开始编译   公共业务实体
call %builder_path% /c %meta_path%\公共业务实体.be
call %msbuild% %code_path%\IWEHAVE.ERP.PubBE\IWEHAVE.ERP.PubBE.sln /p:Configuration=Release

echo 开始编译   公共业务服务
call %builder_path% /c %meta_path%\公共业务服务.bp
call %msbuild% %code_path%\IWEHAVE.ERP.PubBP\IWEHAVE.ERP.PubBP.sln /p:Configuration=Release

echo 开始编译   设施管理实体
call %builder_path% /c %meta_path%\设施管理实体.be
call %msbuild% %code_path%\IWEHAVE.ERP.FacilityBE\IWEHAVE.ERP.FacilityBE.sln /p:Configuration=Release

echo 开始编译   设施管理服务
call %builder_path% /c %meta_path%\设施管理服务.bp
call %msbuild% %code_path%\IWEHAVE.ERP.FacilityBP\IWEHAVE.ERP.FacilityBP.sln /p:Configuration=Release

echo 开始编译   收费实体组件
call %builder_path% /c %meta_path%\收费实体组件.be
call %msbuild% %code_path%\IWEHAVE.ERP.ChargeBE\IWEHAVE.ERP.ChargeBE.sln /p:Configuration=Release

echo 开始编译   收费服务工程
call %builder_path% /c %meta_path%\收费服务工程.bp
call %msbuild% %code_path%\IWEHAVE.ERP.ChargeBP\IWEHAVE.ERP.ChargeBP.sln /p:Configuration=Release

echo 开始编译   停车实体组件
call %builder_path% /c %meta_path%\停车实体组件.be
call %msbuild% %code_path%\IWEHAVE.ERP.VehicleBE\IWEHAVE.ERP.VehicleBE.sln /p:Configuration=Release

echo 开始编译   停车收费服务
call %builder_path% /c %meta_path%\停车收费服务.bp
call %msbuild% %code_path%\IWEHAVE.ERP.VehicleBP\IWEHAVE.ERP.VehicleBP.sln /p:Configuration=Release

echo 开始编译   桌面实体组件
call %builder_path% /c %meta_path%\桌面实体组件.be
call %msbuild% %code_path%\IWEHAVE.ERP.DeskBE\IWEHAVE.ERP.DeskBE.sln /p:Configuration=Release

echo 开始编译   桌面服务组件
call %builder_path% /c %meta_path%\桌面服务组件.bp
call %msbuild% %code_path%\IWEHAVE.ERP.DeskBP\IWEHAVE.ERP.DeskBP.sln /p:Configuration=Release

echo 开始编译   文件导出服务
call %builder_path% /c %meta_path%\文件导出服务.bp
call %msbuild% %code_path%\IWEHAVE.ERP.OfficeExportBP\IWEHAVE.ERP.OfficeExportBP.sln /p:Configuration=Release

echo 开始编译   集团版服务
call %builder_path% /c %meta_path%\集团版服务.bp
call %msbuild% %code_path%\IWEHAVE.ERP.GroupBP\IWEHAVE.ERP.GroupBP.sln /p:Configuration=Release

 echo 开始编译    PlugIn
call %msbuild% %code_path%\PlugIn\IWEHAVE.ERP.PlugIn.Retail\IWEHAVE.ERP.PlugIn.Retail.sln /p:Configuration=Release

echo 复制ApplicationLib文件到当前网站ApplicationLib目录
xcopy "%app_path%\*.*" "%app_path%\..\..\产品代码\GAIA.Web.Retail\GAIA.Web.Retail\ApplicationLib" /y /q
xcopy "%script_path%\*.svc" "%script_path%\..\..\产品代码\GAIA.Web.Retail\GAIA.Web.Retail\ApplicationLib" /y /q
xcopy "%code_path%\PlugIn\IWEHAVE.ERP.PlugIn.Retail\IWEHAVE.ERP.PlugIn.Retail\bin\Release\IWEHAVE.ERP.PlugIn.Auth.*" "%app_path%\..\..\产品代码\GAIA.Web.Retail\GAIA.Web.Retail\ApplicationLib\PlugIn\" /y /q

echo 复制对外服务库到其他目录ApplicationLib文件夹
xcopy "%app_path%\IWEHAVE.ERP.StoreBE.Deploy.*" "%app_path%\..\..\..\GAIA客流分析\产品代码\GAIA.Web.Traffik\GAIA.Web.Traffik\ApplicationLib" /y /q
xcopy "%app_path%\IWEHAVE.ERP.Retail.ServiceBP.Agent.*" "%app_path%\..\..\..\GAIA客流分析\产品代码\GAIA.Web.Traffik\GAIA.Web.Traffik\ApplicationLib" /y /q




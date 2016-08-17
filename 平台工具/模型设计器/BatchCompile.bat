@echo off
set dir_Path=%~dp0%
set builder_path=%dir_Path%Net.Code.Generator.Win.exe
set meta_path=%dir_Path%..\MetaData
set runtime_path=%dir_Path%..\Runtime
set app_path=%dir_Path%..\ApplicationLib
set script_path=%dir_Path%..\Script
set code_path=%dir_Path%..\Code
set msbuild=C:\Windows\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe
echo ��ʼ����   ����ʵ�����
call %builder_path% /c %meta_path%\����ʵ�����.be
call %msbuild% %code_path%\IWEHAVE.ERP.StoreBE\IWEHAVE.ERP.StoreBE.sln /p:Configuration=Release

echo ��ʼ����   ���̷������
call %builder_path% /c %meta_path%\���̷������.bp
call %msbuild% %code_path%\IWEHAVE.ERP.StoreBP\IWEHAVE.ERP.StoreBP.sln /p:Configuration=Release

echo ��ʼ����   ����ʵ�����
call %builder_path% /c %meta_path%\����ʵ�����.be
call %msbuild% %code_path%\IWEHAVE.ERP.ChartsBE\IWEHAVE.ERP.ChartsBE.sln /p:Configuration=Release

echo ��ʼ����   ����������
call %builder_path% /c %meta_path%\����������.bp
call %msbuild% %code_path%\IWEHAVE.ERP.ChartsBP\IWEHAVE.ERP.ChartsBP.sln /p:Configuration=Release

echo ��ʼ����   ����ҵ��ʵ��
call %builder_path% /c %meta_path%\����ҵ��ʵ��.be
call %msbuild% %code_path%\IWEHAVE.ERP.ExpandBE\IWEHAVE.ERP.ExpandBE.sln /p:Configuration=Release

echo ��ʼ����   ����ҵ�����
call %builder_path% /c %meta_path%\����ҵ�����.bp
call %msbuild% %code_path%\IWEHAVE.ERP.ExpandBP\IWEHAVE.ERP.ExpandBP.sln /p:Configuration=Release

echo ��ʼ����   ����ҵ��ʵ��
call %builder_path% /c %meta_path%\����ҵ��ʵ��.be
call %msbuild% %code_path%\IWEHAVE.ERP.PubBE\IWEHAVE.ERP.PubBE.sln /p:Configuration=Release

echo ��ʼ����   ����ҵ�����
call %builder_path% /c %meta_path%\����ҵ�����.bp
call %msbuild% %code_path%\IWEHAVE.ERP.PubBP\IWEHAVE.ERP.PubBP.sln /p:Configuration=Release

echo ��ʼ����   ��ʩ����ʵ��
call %builder_path% /c %meta_path%\��ʩ����ʵ��.be
call %msbuild% %code_path%\IWEHAVE.ERP.FacilityBE\IWEHAVE.ERP.FacilityBE.sln /p:Configuration=Release

echo ��ʼ����   ��ʩ�������
call %builder_path% /c %meta_path%\��ʩ�������.bp
call %msbuild% %code_path%\IWEHAVE.ERP.FacilityBP\IWEHAVE.ERP.FacilityBP.sln /p:Configuration=Release

echo ��ʼ����   �շ�ʵ�����
call %builder_path% /c %meta_path%\�շ�ʵ�����.be
call %msbuild% %code_path%\IWEHAVE.ERP.ChargeBE\IWEHAVE.ERP.ChargeBE.sln /p:Configuration=Release

echo ��ʼ����   �շѷ��񹤳�
call %builder_path% /c %meta_path%\�շѷ��񹤳�.bp
call %msbuild% %code_path%\IWEHAVE.ERP.ChargeBP\IWEHAVE.ERP.ChargeBP.sln /p:Configuration=Release

echo ��ʼ����   ͣ��ʵ�����
call %builder_path% /c %meta_path%\ͣ��ʵ�����.be
call %msbuild% %code_path%\IWEHAVE.ERP.VehicleBE\IWEHAVE.ERP.VehicleBE.sln /p:Configuration=Release

echo ��ʼ����   ͣ���շѷ���
call %builder_path% /c %meta_path%\ͣ���շѷ���.bp
call %msbuild% %code_path%\IWEHAVE.ERP.VehicleBP\IWEHAVE.ERP.VehicleBP.sln /p:Configuration=Release

echo ��ʼ����   ����ʵ�����
call %builder_path% /c %meta_path%\����ʵ�����.be
call %msbuild% %code_path%\IWEHAVE.ERP.DeskBE\IWEHAVE.ERP.DeskBE.sln /p:Configuration=Release

echo ��ʼ����   ����������
call %builder_path% /c %meta_path%\����������.bp
call %msbuild% %code_path%\IWEHAVE.ERP.DeskBP\IWEHAVE.ERP.DeskBP.sln /p:Configuration=Release

echo ��ʼ����   �ļ���������
call %builder_path% /c %meta_path%\�ļ���������.bp
call %msbuild% %code_path%\IWEHAVE.ERP.OfficeExportBP\IWEHAVE.ERP.OfficeExportBP.sln /p:Configuration=Release

echo ��ʼ����   ���Ű����
call %builder_path% /c %meta_path%\���Ű����.bp
call %msbuild% %code_path%\IWEHAVE.ERP.GroupBP\IWEHAVE.ERP.GroupBP.sln /p:Configuration=Release

 echo ��ʼ����    PlugIn
call %msbuild% %code_path%\PlugIn\IWEHAVE.ERP.PlugIn.Retail\IWEHAVE.ERP.PlugIn.Retail.sln /p:Configuration=Release

echo ����ApplicationLib�ļ�����ǰ��վApplicationLibĿ¼
xcopy "%app_path%\*.*" "%app_path%\..\..\��Ʒ����\GAIA.Web.Retail\GAIA.Web.Retail\ApplicationLib" /y /q
xcopy "%script_path%\*.svc" "%script_path%\..\..\��Ʒ����\GAIA.Web.Retail\GAIA.Web.Retail\ApplicationLib" /y /q
xcopy "%code_path%\PlugIn\IWEHAVE.ERP.PlugIn.Retail\IWEHAVE.ERP.PlugIn.Retail\bin\Release\IWEHAVE.ERP.PlugIn.Auth.*" "%app_path%\..\..\��Ʒ����\GAIA.Web.Retail\GAIA.Web.Retail\ApplicationLib\PlugIn\" /y /q

echo ���ƶ������⵽����Ŀ¼ApplicationLib�ļ���
xcopy "%app_path%\IWEHAVE.ERP.StoreBE.Deploy.*" "%app_path%\..\..\..\GAIA��������\��Ʒ����\GAIA.Web.Traffik\GAIA.Web.Traffik\ApplicationLib" /y /q
xcopy "%app_path%\IWEHAVE.ERP.Retail.ServiceBP.Agent.*" "%app_path%\..\..\..\GAIA��������\��Ʒ����\GAIA.Web.Traffik\GAIA.Web.Traffik\ApplicationLib" /y /q




@echo off
"C:\Program Files\MariaDB 11.4\bin\mariadb.exe" -u root -root nu_cms < c:\Users\asus\dev\nu-CMS\CREATE_SY_CONFIG.sql
"C:\Program Files\MariaDB 11.4\bin\mariadb.exe" -u root -root nu_cms < c:\Users\asus\dev\nu-CMS\CREATE_AUDIT_LOG.sql
pause

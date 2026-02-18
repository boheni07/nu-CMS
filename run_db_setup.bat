@echo off
"C:\Program Files\MariaDB 11.8\bin\mariadb.exe" -u root -proot nucms < c:\Users\asus\dev\nu-CMS\CREATE_SY_CONFIG.sql
"C:\Program Files\MariaDB 11.8\bin\mariadb.exe" -u root -proot nucms < c:\Users\asus\dev\nu-CMS\CREATE_AUDIT_LOG.sql
pause

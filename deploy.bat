ng build --prod
del C:\repos\great-admin-backend\public\assets\data\*.*
del C:\repos\great-admin-backend\public\assets\images\*.*
del C:\repos\great-admin-backend\public\*.*

xcopy c:\repos\great-admin\dist\great-admin\*.* c:\repos\great-admin-backend\public\ /S /C /R /Y

move c:\repos\great-admin\dist\great-admin\*.* c:\repos\great-admin-backend\public\ -recurse -Force

Copy-Item -Path c:\repos\great-admin\dist\great-admin\ -Destination c:\repos\great-admin-backend\public\ -PassThru

git push heroku master
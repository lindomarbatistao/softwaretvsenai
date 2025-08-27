@ECHO OFF
CD "C:\Sistema TV\"
pm2 start server/index.js
PAUSE
@ECHO OFF
CD "C:\Sistema TV\site\"
pm2 serve build/ 3000 --name "front" --spa
PAUSE
// sudo killall -15 fbi
// sudo killall -15 node
// sudo killall -15 electron
// sudo killall -15 omxplayer
cd /home/pi/videoloop
clear

sudo pm2 stop playLoop.js
sudo pm2 start playLoop.js
#sudo node playLoop
#process.exit();


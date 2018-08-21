
# S3 to Local Photo Bucket Sync
This application syncs files between a local drive and a S3 storage container on AWS

Application requires a ./config/creds.js file to provide the following values:

module.exports.access_key = 'blahblah';  
module.exports.secret_access_key = 'soandso';  
module.exports.LOCAL_ROOT =  'YOUR\\LOCAL\\MEDIA\\FOLDER';  
module.exports.LOCAL_FOLDER =  'YOUR\\LOCAL\\MEDIA\\SUB-FOLDER';  
module.exports.BUCKET_NAME = 'YOUR S3 BUCKET NAME';  
module.exports.BUCKET_PREFIX = 'YOUR S3 BUCKET SUB-FOLDER/ROOT'; 

# CL tools:
node, gulp, nvm, avn

NVM - Node version manager - if you don't have it, install it
https://github.com/creationix/nvm/blob/master/README.md

AVN - automatic version switching for node (no more `$ nvm use`)
https://github.com/wbyoung/avn

Make sure you're using node version compatible with container repo:
$ echo v8.7.0 > .node_version

# Hardware Initialization
Steps to setup hardware device configuration

1. Format SD card with raspian
2. Run installation script:
   a) install git

   b) install npm/node 
   		sudo npm cache clean -f
		sudo npm install -g n
		sudo n stable
		sudo n latest


   c) install pm2


   d) upload news dashboard folder 


   e) upload videoloop folder


   f) setup crontab recurring reset.sh 
   crontab -e => COPY FILE FROM 

   g) setup news dashboard in pm2


   h) Update
   sudo apt-get-update

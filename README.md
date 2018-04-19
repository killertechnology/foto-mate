

# S3 to Local Photo Bucket Sync
This application syncs files between a local drive and a S3 storage container on AWS

Application requires a ./config/creds.js file to provide the following values:

`module.exports.access_key = 'blahblah';  
module.exports.secret_access_key = 'soandso';  
module.exports.LOCAL_ROOT =  'YOUR\\LOCAL\\MEDIA\\FOLDER';  
module.exports.LOCAL_FOLDER =  'YOUR\\LOCAL\\MEDIA\\SUB-FOLDER';  
module.exports.BUCKET_NAME = 'YOUR S3 BUCKET NAME';  
module.exports.BUCKET_PREFIX = 'YOUR S3 BUCKET SUB-FOLDER/ROOT';`  

# CL tools:
node, gulp, nvm, avn

NVM - Node version manager - if you don't have it, install it
https://github.com/creationix/nvm/blob/master/README.md

AVN - automatic version switching for node (no more `$ nvm use`)
https://github.com/wbyoung/avn

Make sure you're using node version compatible with container repo:
$ echo v8.7.0 > .node_version

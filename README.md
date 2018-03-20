#This application syncs files between a local drive and a S3 storage container on AWS

# Enjoy

#Application requires a ./config/creds.js file to provide the following values:

module.exports.access_key = 'blahblah';
module.exports.secret_access_key = 'soandso';
module.exports.LOCAL_ROOT =  'YOUR\\LOCAL\\MEDIA\\FOLDER';
module.exports.LOCAL_FOLDER =  'YOUR\\LOCAL\\MEDIA\\SUB-FOLDER';
module.exports.BUCKET_NAME = 'YOUR S3 BUCKET NAME';
module.exports.BUCKET_PREFIX = 'YOUR S3 BUCKET SUB-FOLDER/ROOT';
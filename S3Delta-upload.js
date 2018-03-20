var creds = require("./config/creds.js");
var AWS = require('aws-sdk');
var http = require('http');
var delay = require('delay');
var fs = require('fs');
var dirTree = require('directory-tree');
var arraylist = require("arraylist")

var fileUrl;
var _thisFileSize;
var download;
var _thisIteration = -1;
var file;
var request;
var _numFilesMissing=0;
var s3 = new AWS.S3();
var list = new arraylist;

//Load in the local file tree
const tree = dirTree(creds.LOCAL_FOLDER, {extensions:/\.*$/}, (item, PATH) => {
	list.add([item.path]); //console.log(item.path);
});

var _uploadFiles = false;
AWS.config.update({accessKeyId: creds.access_key, secretAccessKey: creds.secret_access_key, region: 'us-east-1'});
console.log("UPLOADING IS SET TO: " + _uploadFiles)
showMissingFiles();


function showMissingFiles() {

	//FOR EACH FILE IN THE TREE - 
	_thisIteration++;

	//CHECK IF EXISTS ON S3
	if (list.length>0){

		_localPath = list.get(_thisIteration).replace(creds.LOCAL_ROOT,'');
		_remotePath = list.get(_thisIteration);

		var string = _remotePath;
		var _delimiter = getPosition(string, '\\', 4) // --> 16
		var _remotePathParentFolder = _remotePath.substring(0,_delimiter)

		_localPath = _localPath.replace(/\\/g,'/')

		params = { 
		 Bucket: creds.BUCKET_NAME,
		 Key: _localPath
		}

		s3.headObject(params, function (err, metadata) {  
		  if (err && err.code === 'NotFound') {  
		  	console.log(_numFilesMissing + " - NF => UPLOADING FILE (" + _uploadFiles + "): " + _localPath)
		  	_numFilesMissing++;
		  	if (_uploadFiles)
		  		UploadFiletoS3(_localPath); 
		  	else if (_thisIteration<(list.length-1))
		  		showMissingFiles();
		  } 
		  else {  
		    s3.getSignedUrl('getObject', params);
		    
		    if ((_thisIteration % 100)==0)
		    	console.log('working... ' + _thisIteration + ' files processed. Current: ' + _localPath);

		    if (_thisIteration<(list.length-1))
		  		showMissingFiles();
		  }
		});
	}
	else
		console.log("No Files Found in " + creds.LOCAL_FOLDER)
}

function UploadFiletoS3(_key){

	console.log(_key)
	var _filePath = creds.LOCAL_ROOT + _key.replace(/\//g,'\\');
	console.log("");
	var bodystream = fs.createReadStream(_filePath);
	var _mimeType = _localPath.substring(_localPath.indexOf(".")+1,_localPath.length);

	if (_mimeType == "jpg"){ _mimeType = "image/jpeg"	}
	if (_mimeType == "gif"){ _mimeType = "image/gif"	}
	if (_mimeType == "mov"){ _mimeType = "video/quicktime"	}
	if (_mimeType == "mp4"){ _mimeType = "video/mp4"	}

    var params = {
        Bucket: creds.BUCKET_NAME,
        'Key': _key,
        'Body': bodystream,
        'ContentEncoding': 'base64', 
        'ContentType': _mimeType
     };

     s3.upload(params, function(err, data){
		console.log("UPLOAD #: " + _thisIteration + '-- ' + _key);
        if (_thisIteration<(list.length-1))
	  		showMissingFiles();
     }) 
}


function S3Callback(){

	//console.log("FILE FOUND")
}

function getPosition(string, subString, index) {
   return string.split(subString, index).join(subString).length;
}



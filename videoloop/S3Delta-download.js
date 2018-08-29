var creds = require("./config/creds.js");
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var http = require('http');
var delay = require('delay');
var fs = require('fs');

var fileUrl;
var _thisFolder;
var _currentVidSet;
var _thisFileSize;
var download;
var _thisIteration = 0;
var _subfolderList;
var _allFolders='';
var nameList = [];
var _nodeIteration = -1;


AWS.config.update({accessKeyId: creds.access_key, secretAccessKey: creds.secret_access_key, region: 'us-west-2'});

var _downloadFiles = false;
getSubFolders('/')

//Split all folders into an array list
_subfolderList = buildFolderList();

function buildFolderList(){
	delay(3000).then(() => {//
		_allFolders = _allFolders.substring(0,_allFolders.length-1)
		console.log("AKKFIKDERS: " + _allFolders)
		nameList = _allFolders.split('|');
		
		for (var i = 0;i<nameList.length;i++)
			console.log("FOLDER: " + nameList[i])
		
		//Loop through all subFolders to obtain files in that node
		getNodeFiles(_nodeIteration); //0
	});
}


function getSubFolders(_prefix){
	console.log("GETTING FOLDER: " + _prefix)

	if (_prefix.length>0){
		s3.listObjects({
		  Bucket: creds.BUCKET_NAME,
		  Delimiter: '/',
		  MaxKeys: 1000,
		  Prefix: _prefix
		}, function (error, response) {
			console.log('RESPONSE: ' + JSON.stringify(response))
			console.log('ERROR: ' + error)
			response.Contents.map(
			  	function (obj) { 
			  		_thisFolder = obj.Key;	  		//
			  		console.log('GETTUBG FOLDER: ' + _thisFolder);
			  		return obj.Key; 
			  	}
		  	)
			_subfolderList = response.CommonPrefixes;
			for (var i = 0;i<_subfolderList.length;i++){
				if (_subfolderList[i].Prefix!=null){
				  	if (_prefix.length>2){ _allFolders += _subfolderList[i].Prefix + "|"; 	}
				  	if (/**/(_subfolderList[i].Prefix == "Video/") || (_subfolderList[i].Prefix == "photos/")){
				  		getSubFolders(_subfolderList[i].Prefix)
				  	}
				}
			}
		});

	}
	
}


function getNodeFiles(){

	delay(2000).then(() => {//
		_thisIteration=0;
		_nodeIteration++;

		_node = nameList[_nodeIteration]
		console.log("\r\nEXTRACTING NODE " + _nodeIteration + ": " + _node)
 	
		var DLparams = { 
		 Bucket: creds.BUCKET_NAME,
		 Delimiter: '/',
		 Prefix: _node
		}
		
		s3.listObjects(DLparams, function (err, data) {

			if(err)throw err;
			var totalMessages = Object.keys(data.Contents).length;
			for (var i = 0;i<totalMessages;i++)
				console.log(data.Contents[i].Key)

			console.log('totalMessages: ' +totalMessages);
			if (totalMessages<2){ getNodeFiles();return; }

			downloadFile();

			function downloadFile() {
				_thisIteration++;

				if (data.Contents[_thisIteration]==null){ console.log("Null item found.  moving on"); getNodeFiles(); }
				if (data.Contents[_thisIteration].Key.indexOf(".")<0){ _thisIteration++; }
		        fileUrl = "http://s3-us-west-2.amazonaws.com/" + creds.BUCKET_NAME + "/" + data.Contents[_thisIteration].Key;
				_thisFilePath = data.Contents[_thisIteration].Key;
				_thisFileSize = Math.round(data.Contents[_thisIteration].Size / 1000000);
				if (!(fs.existsSync(_thisFilePath))) {
				 
					if (_downloadFiles){
					    console.log("FILE NOT FOUND - DOWNLOADING: " + data.Contents[_thisIteration].Key)
						/*	*/
					    file = fs.createWriteStream(data.Contents[_thisIteration].Key);
						
						request = http.get(fileUrl, function(response) {

					    	if (response.statusCode === 200)
					    		response.pipe(file);

						    file.on('error', function() {
								console.log("ERROR")
							  	if (_thisIteration<totalMessages-1) { downloadFile() }
							  	else{ getNodeFiles(); }
							});

						    file.on('finish', function() {
						    	console.log("file written: " + response.statusCode)
							  	file.close(); 
							  	if (_thisIteration<totalMessages-1) { downloadFile() }
							  	else{ getNodeFiles(); }
							});
						});
					}
					else{
						console.log("FILE NOT FOUND - DOWNLOAD DISABLED: " + data.Contents[_thisIteration].Key)
						if (_thisIteration<totalMessages-1) { downloadFile() }
						else{  getNodeFiles(); }
					}
				}
				else{
					console.log("SKIPPING FILE #" + _thisIteration + ": " + data.Contents[_thisIteration].Key)
					if (_thisIteration<(totalMessages-1)) { downloadFile() }
					else{ getNodeFiles(); }
				}
			}
		});
	});
}


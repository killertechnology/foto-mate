var creds = require("./config/creds.js");
var fs = require('fs');
var AWS = require('aws-sdk');
var http = require('http');
var delay = require('delay');
var s3 = new AWS.S3();

AWS.config.update({accessKeyId: creds.access_key, secretAccessKey: creds.secret_access_key, region: 'us-east-1'});


var fileUrl;
var _thisFileSize;
var params = { 
 Bucket: creds.BUCKET_NAME,
 Prefix: creds.BUCKET_PREFIX
}

s3.listObjects(params, function (err, data) {
	if(err)throw err;
	var totalMessages = Object.keys(data.Contents).length;
	loadVideos();

    function loadVideos() {
		var playString = 'omx.play(['; 
		var _rndNum = 10;//(Math.floor(Math.random() * 2) + 1);
		for ( var i = 0; i < 50; i++){
			_thisFileSize = Math.round(data.Contents[i].Size / 1000000);
			console.log("ID: " + data.Contents[i].Key + "  -\tSize: " + _thisFileSize +" Mb");
		  	_rndNum = (Math.floor(Math.random() * 100) + 1);
		  	playString += "'" + data.Contents[_rndNum].Key + "',";
		}

		playString = playString.substring(0,playString.length-1);
		playString += '], {loop: true});'; 
		//console.log(playString);
	}
});
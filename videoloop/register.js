
"use strict"

const PATH = require('path');
const dirTree = require('directory-tree');
var creds = require("./config/creds.js");
var http = require('http');
var delay = require('delay');
var s3 = new AWS.S3();


var AWS = require('aws-sdk'),
    fs = require('fs');

//Ping the fotomate server to send self-IP address for device ID in credentials file


// For dev purposes only
//AWS.config.update({ accessKeyId: '...', secretAccessKey: '...' });
AWS.config.update({accessKeyId: creds.access_key, secretAccessKey: creds.secret_access_key, region: 'us-west-2'});

// Read in the file, convert it to base64, store to S3
fs.readFile('del.txt', function (err, data) {
  if (err) { throw err; }

  var base64data = new Buffer(data, 'binary');

  var s3 = new AWS.S3();
  s3.client.putObject({
    Bucket: 'banners-adxs',
    Key: 'del2.txt',
    Body: base64data,
    ACL: 'public-read'
  },function (resp) {
    console.log(arguments);
    console.log('Successfully uploaded package.');
  });

});
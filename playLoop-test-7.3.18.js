
"use strict"

const PATH = require('path');
const delay = require('delay');
const dirTree = require('directory-tree');
var arraylist = require("arraylist")
var getDimensions = require('get-video-dimensions');
var list = new arraylist;
var photolist = new arraylist;
var videoString  = new arraylist;
var _thisVid = '';
var _thisPhoto = '';
var _thisIteration = 0;
var _duration = 99;
const shell = require('shelljs');
//const omx = require('omxdirector');
const fs = require('fs');
const VideoLib = require('node-video-lib');
var sizeOf = require('image-size');
var dimensions;
var ExifImage = require('exif').ExifImage;
var _vidsLoaded=0;
var _numVidstoLoad = 2;
var _numVidstoSearch = 200;
var _playerIsReady = false;
var _debug = false;
var photoString;
var process = require('process');
const tree = dirTree('./Video/', {extensions:/\.*$/}, (item, PATH) => {
	
	if (item.path.indexOf('.mp4')>-1){
		list.add([item.path]);
	}
	
});

const phototree = dirTree('./photos/', {extensions:/\.*$/}, (item, PATH) => {
	
	photolist.add([item.path]);
});

function loadPhotos(){
	var _numPhotostoLoad = 5
	var _thisPhotofn;
	console.log('loading photos')
	_thisIteration=0;
	photoString  = new arraylist;
	var _rndNum = 0;//(Math.floor(Math.random() * 2) + 1);
	for(var i = 0; i < 10; i++){
		_rndNum = (Math.floor(Math.random() * (photolist.length-1)) + 1);
		_thisPhotofn = [photolist.get(_rndNum)];

		if ( (_thisPhotofn.length>0) && (_thisPhotofn.indexOf(' ')<1) && (_thisPhotofn.indexOf('black.jpg')<1) && (_thisPhotofn.indexOf('(')<1)){
			photoString.add(_thisPhotofn);
			_thisIteration++;

			if (_thisIteration >= _numPhotostoLoad){ console.log(photoString); /**/ playImages(photoString); console.log('done.'); return false; }
		}

	}
}

function getDuration(selectedPath){
	//console.log('selectedPath: ' + selectedPath);
	if (_vidsLoaded <= _numVidstoLoad){

		fs.open(selectedPath, 'r', function(err, fd) {
		    try {
		    	//console.log('video: ' + selectedPath)
		        let movie = VideoLib.MovieParser.parse(fd);
		        _duration = movie.relativeDuration();
				
				//delay(300).then(() => {//
					
					//let _thisFragmentList = movie.FragmentList;
		        	if ((_duration > 2) && (_duration < 33)){
		        		

						if ((_vidsLoaded >= _numVidstoLoad) && (!_playerIsReady)){ 
			        		console.log('moving to player => ' + _playerIsReady)
			        		_playerIsReady = true;
							playVids(videoString); 
							//return false; 
							console.log('moved to player')
						}
						else if ((_vidsLoaded < _numVidstoLoad)) {
							console.log('adding ' + selectedPath + '. Duration: ' + _duration + '. Iteration:'+_vidsLoaded); // (width:' + movie.FragmentList.width + ' x height: ' + movie.FragmentList.width +' ).
							videoString.add(selectedPath + '|' + _duration);
							_vidsLoaded++;
						}
		        	}
		       // });
	        	
	        	//else
	        	//	console.log('Video too long. Ignored')
					
		    } catch (ex) {
		       console.log('getDuration - Error encountered:', selectedPath + ex);
		       //shell.cd('sh reset.sh');
		    } finally {
		        fs.closeSync(fd);
		    }



		    return 0;
		});

	}
	
	
}

function loadVideos(){
	
	_playerIsReady = false;

	shell.exec('sudo pkill fbi 2> /dev/null');
	//shell.exec("sudo fbi --noverbose -T 1 -t 30 ./black.jpg 2>/dev/null" );

	console.log('loading videos')
	_vidsLoaded=0;
	videoString  = new arraylist;
	var _rndNum = 0;//(Math.floor(Math.random() * _numVidstoLoad) + 1);
	var _thisPath = '';//home/pi/videoloop/'+_thisVid;

	
		for(var i = 0; i < _numVidstoSearch; i++){
			_rndNum = (Math.floor(Math.random() * (list.length-1)) + 1);
			_thisVid = [list.get(_rndNum)];

			//console.log('_thisVid #'+_rndNum+' : ' + _thisVid)
			
			
				if ((_thisVid.length>0) && (!_playerIsReady)){
					_thisPath = '/home/pi/videoloop/'+_thisVid;
					//videoString.add(_thisVid);
					//
						getDuration(_thisPath);

					//
					
				}

			
		}

		

}


//var omx = require('omxdirector');
//omx.play(videoString, {loop: true });
function playVids(theseVideos){
	
	var _currPlayingVid = 0;
	//console.log('killing images - prepping video'); 
	//shell.exec('sudo pkill fbi 2> /dev/null');
	//omx.on('load', function(files, options){ console.log(' video loaded' + files); }); // video successfully loaded (omxprocess starts)
	/*
	omx.on('play', 
		function(){
			shell.exec('free -m');
			console.log('playing video loop');
			loadPhotos();
			//shell.exec('clear');
		}
	);  


	omx.on('stop', 
		function(){ 
			console.log('loop stopped'); 
			//process.exit(); 

			if (_currPlayingVid>1){ playImages(photoString); }
			//loadPhotos();
		}
	); 
	*/
	delay(300).then(() => {//

		var _thisVideo;
		var _cmd = '';
		var _thisVidStartPos="00:00:00";
		var _thisVidScreenSize=' --win "384 388 1024 748" ';
		//console.log('OMX STATUS: ' + omx.getStatus())
		/*
		
		omx.play(theseVideos); 

		

		omx.play(theseVideos[0]);  _currPlayingVid++;
		omx.play(theseVideos[1]);  _currPlayingVid++;
		omx.play(theseVideos[2]);  _currPlayingVid++;
*/		
		
		
		try {
			if (theseVideos[0]!=null){ 
				_thisVideo = theseVideos[0].split('|');
		       	//if (_thisVideo[1] > 20) { _thisVidStartPos = "00:00:20";} 
				_cmd = 'sudo omxplayer -l ' + _thisVidStartPos + ' -o hdmi  ' + _thisVidScreenSize + _thisVideo[0]
				console.log('starting video 0 - ' +_cmd);
				shell.exec(_cmd); 
			}
				
				
	    } catch (ex) {
	    	
	        console.log('Error playing video:', ex);
	        //shell.cd('sh reset.sh');
	    } finally {
	       shell.exec('sudo pkill omxplayer'); 
	    }



	    try {
			if (theseVideos[1]!=null){ 
				_thisVideo = theseVideos[1].split('|')
				//if (_thisVideo[1] > 20) { _thisVidStartPos = "00:00:20";} 
				_cmd = 'sudo omxplayer -l ' + _thisVidStartPos + ' -o hdmi  ' + _thisVidScreenSize + _thisVideo[0]
				console.log('starting video 1 - ' +_cmd);
				shell.exec(_cmd); 
			}

	    } catch (ex) {
	        console.log('Error playing video:', ex);
	        //shell.cd('sh reset.sh');
	    } finally {
	       shell.exec('sudo pkill omxplayer'); 
	    }



	    try {
	       if (theseVideos[2]!=null){ 
				_thisVideo = theseVideos[2].split('|')
				//if (_thisVideo[2] > 20) { _thisVidStartPos = "00:00:20";} 
				_cmd = 'sudo omxplayer -l ' + _thisVidStartPos + ' -o hdmi  ' + _thisVidScreenSize + _thisVideo[0]
				console.log('starting video 2 - ' +_cmd);
				shell.exec(_cmd); 
			}
	    } catch (ex) {
	        console.log('Error playing video:', ex);
	        //shell.cd('sh reset.sh');
	    } finally {
	       shell.exec('sudo pkill omxplayer'); 
	    }
		
		/**/
		console.log('playlist complete.')
		loadPhotos();
		
	});
	
}

function playImages(photoString){

	var _img0ResizeAttr = " -a";
	var _img1ResizeAttr = " -a";
	var _img2ResizeAttr = " -a";
	var _img3ResizeAttr = " -a";

	var _img0data;
	var _img1data;
	var _img2data;
	var _img3data;

	var _img0err;
	var _img1err;
	var _img2err;
	var _img3err;
	
	shell.cd('/home/pi/videoloop');
	console.log('playing IMAGE loop');
	

		try {
	        new ExifImage({ image : photoString[0] }, function (error, exifData0) {
				dimensions = sizeOf(photoString[0]);
				if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img0ResizeAttr = "-fitwidth" }
				if (exifData0 !=null){	
					_img0data = exifData0.image.Orientation;
					if (_img0data != 1) { rewriteImagebyOrientation(exifData0,0); } 
				}
				_img0err = error +'.0';

		    });
        	//	console.log('Video too long. Ignored')
				
	    } catch (ex) {
	        console.log('playImages - Rewrite Error encountered:', selectedPath + ex);
	        //shell.cd('sh reset.sh');
	    } finally {
	       
	       
	    }

    	
	

	delay(200).then(() => {//
			
	    	new ExifImage({ image : photoString[1] }, function (error, exifData1) {
				dimensions = sizeOf(photoString[1]);
				if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img1ResizeAttr = "-fitwidth" }
				if (exifData1 !=null){	
					_img1data = exifData1.image.Orientation;
					if (_img1data != 1) { rewriteImagebyOrientation(exifData1,1); }
				}
				_img1err = error +'.1';
		    });

		    new ExifImage({ image : photoString[2] }, function (error, exifData2) {
					dimensions = sizeOf(photoString[2]);
					if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img2ResizeAttr = "-fitwidth" }
					if (exifData2 !=null){
						_img2data = exifData2.image.Orientation;
						if (_img2data != 1) { rewriteImagebyOrientation(exifData2,2); }
					}
					_img2err = error +'.2';
			    });
		

	}) ; 

		delay(400).then(() => {

		    	new ExifImage({ image : photoString[3] }, function (error, exifData3) {
					dimensions = sizeOf(photoString[3]);
					if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img3ResizeAttr = "-fitwidth" }
					if (exifData3 !=null){
						_img3data = exifData3.image.Orientation;
						if (_img3data != 1) { rewriteImagebyOrientation(exifData3,3); } 
					}
					_img3err = error +'.3';
			    });
			 });

	
	delay(600).then(() => {//

		try {
		
			shell.exec('sudo pkill fbi 2>/dev/null');
			//shell.exec("sudo fbi --noverbose -T 1 -t 15 ./black.jpg");// -a
			console.log("\r\n0: ORIENTATION: " + _img0data + ' -- ' + photoString[0] + '\r\n' + _img0err);// + ' -- ' + dimensions.width + ' x ' + dimensions.height);
			shell.exec("sudo fbi '" + photoString[0] + "' " + _img0ResizeAttr  + " -a -T 1 -t 5 " + photoString[0]);// 2>/dev/null");// --noverbose        
	    } catch (ex) {
	        console.log('FBI 0 Error encountered:', selectedPath + ex);
	        //shell.cd('sh reset.sh');
	    } finally {
	       
	    }

		
	}).then(() => {//
		
		delay(4000).then(() => {//

			try {
	       
				shell.exec('sudo pkill fbi 2>/dev/null');
				console.log("\r\n1: ORIENTATION: " + _img1data + ' -- ' + photoString[1] + '\r\n' + _img1err);// + ' -- ' + dimensions.width + ' x ' + dimensions.height);
				shell.exec("sudo fbi '" + photoString[1] + "' " + _img1ResizeAttr  + " -a -T 1 -t 5 " + photoString[1]);// + " 2>/dev/null");// --noverbose 
		    } catch (ex) {
		        console.log('FBI 1 Error encountered:', selectedPath + ex);
		        //shell.cd('sh reset.sh');
		    } finally {
		       
		    }
			
		}).then(() => {//

			delay(4000).then(() => {//

				try {
			        shell.exec('sudo pkill fbi 2>/dev/null');
					console.log("\r\n2: ORIENTATION: " + _img2data + ' -- ' + photoString[2] + '\r\n' + _img2err );// + ' -- ' + dimensions.width + ' x ' + dimensions.height);
					shell.exec("sudo fbi '" + photoString[2] + "' " + _img2ResizeAttr  + " -a -T 1 -t 5 " + photoString[2]);// + " 2>/dev/null");// --noverbose 

			    } catch (ex) {
			        console.log('FBI 2 Error encountered:', selectedPath + ex);
			        //shell.cd('sh reset.sh');
			    } finally {
			       
			       
			    }

				
			}).then(() => {//
					
				delay(4000).then(() => {//

					try {
				        shell.exec('sudo pkill fbi 2>/dev/null');
						console.log("\r\n3: ORIENTATION: " + _img3data + ' -- ' + photoString[3] + '\r\n' + _img3err );// + ' -- ' + dimensions.width + ' x ' + dimensions.height);
						shell.exec("sudo fbi '" + photoString[3] + "' " + _img3ResizeAttr  + " -a -T 1 -t 5 " + photoString[3]);// + " 2>/dev/null");// --noverbose 
			        	//	console.log('Video too long. Ignored')
							
				    } catch (ex) {
				        console.log('FBI 3 Error encountered:', selectedPath + ex);
				        //shell.cd('sh reset.sh');
				    } finally {
				       
				       
				    }

					
				}).then(() => {//
					
					delay(4000).then(() => {//

						try {
					        shell.exec('sudo pkill fbi 2>/dev/null');
							shell.exec('sudo find . -name "*-rotated.jpg" -type f -delete');
							loadVideos();
							//shell.exec('node playLoop');// 2>/dev/null ');
							//shell.exec('sudo sh reset.sh');// 2>/dev/null ');
				        	//	console.log('Video too long. Ignored')
								
					    } catch (ex) {
					        console.log('FBI 4 Error encountered:', selectedPath + ex);
					        //shell.cd('sh reset.sh');
					    } finally {
					       
					       
					    }
						
					});
					
				});	
					
			})
		});;
		
	});
	


}


function rewriteImagebyOrientation(_thisExifData, slot){

	//_thisExifData

	if (_thisExifData.image.Orientation == 6) {
		shell.exec("sudo convert " + photoString[slot] + " -rotate 90 " + photoString[slot].replace(".jpg","-rotated.jpg"));
		photoString[slot] = photoString[slot].replace(".jpg","-rotated.jpg");
	}
	else if (_thisExifData.image.Orientation == 3) {
		shell.exec("sudo convert " + photoString[slot] + " -rotate 180 " + photoString[slot].replace(".jpg","-rotated.jpg"));
		photoString[slot] = photoString[slot].replace(".jpg","-rotated.jpg");
	}
	else if (_thisExifData.image.Orientation == 8) {
		shell.exec("sudo convert " + photoString[slot] + " -rotate 270 " + photoString[slot].replace(".jpg","-rotated.jpg"));
		photoString[slot] = photoString[slot].replace(".jpg","-rotated.jpg");
	}
}

function toggleDisplayType(){
	console.log('restarting cycle.')

	loadVideos();

}



loadVideos();
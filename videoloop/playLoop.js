
"use strict"
var process = require('process');
var Promise = require('promise');
const PATH = require('path');
const delay = require('delay');
const dirTree = require('directory-tree');
var arraylist = require("arraylist")
var getDimensions = require('get-video-dimensions');
var videolist = new arraylist;
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

var _numVidstoSearch = 500;
var _playerIsReady = false;
var _maxDuration =35;
var _debug = false;
var photoString;
var _rndNum = 0;
var _numVidstoLoad = 4;
var _numPhotostoLoad = 5



const videotree = dirTree('./Video/', {extensions:/\.*$/}, (item, PATH) => {
	if ((item.path.indexOf('.mp4')>-1)){
		videolist.add([item.path]);
	}
});

const phototree = dirTree('./photos/', {extensions:/\.*$/}, (item, PATH) => {
	photolist.add([item.path]);
});

function loadPhotos(){

	var _thisPhotofn;
	console.log('loading photos: ' + photolist.length + ' items found')
	_thisIteration=0;
	photoString  = new arraylist;
	(Math.floor(Math.random() * 2) + 1);
	for(var i = 0; i < photolist.length; i++){
		_rndNum = (Math.floor(Math.random() * (photolist.length-1)) + 1);
		_thisPhotofn = [photolist.get(_rndNum)];

		if ( (_thisPhotofn.length>0) && (_thisPhotofn.indexOf(' ')<1) && (_thisPhotofn.indexOf('black.jpg')<1) && (_thisPhotofn.indexOf('(')<1)){
			console.log("TEST: " + photoString)
			if (photoString.indexOf(_thisPhotofn)<0){
				photoString.add(_thisPhotofn);
				_thisIteration++;

				if (_thisIteration >= _numPhotostoLoad){ 
					console.log(photoString); /**/ 
					playImages(photoString); 
					console.log('done.'); return false; 
				}				
			}

		}

	}
}



function AddVideoCheck(_thisPath) {
    
    _duration = '';
    _playerIsReady = false;

    return new Promise(function(resolve, reject) {
        // some async operation here
        
        	if (!(_playerIsReady)){
        		fs.open(_thisPath, 'r', function(err, fd) {
				    try {
				    	//console.log('video: ' + selectedPath)
				        let movie = VideoLib.MovieParser.parse(fd);
				        _duration = movie.relativeDuration();

						
						//delay(1000).then(() => {//
							
				        	if ((_duration > 1) && (_duration < _maxDuration)){
				        		
								//check video is not already added
								if (videoString.toString().indexOf(_thisPath)<0) {
									//console.log(); // (width:' + movie.FragmentList.width + ' x height: ' + movie.FragmentList.width +' );
									videoString.add(_thisPath + "|" + movie.relativeDuration() + "|" + movie.resolution());
									_vidsLoaded++;

							        if (_vidsLoaded<_numVidstoLoad) {
							        	resolve('adding ' + _thisPath + "|" + movie.relativeDuration() + "|" + movie.resolution());
								    }
									else{
										_playerIsReady = true;
										resolve('complete');
									} 
								}
								else 
		        					resolve('Video already added. Ignored')
									
				        	}
				        	else
				        		resolve('Video too long. Ignored')

						//});
				    } catch (ex) {
				       console.log('Error encountered:', _thisPath + ex);
				       //shell.cd('sh reset.sh');
				    } finally {
				       fs.closeSync(fd);
				    }

				});
        	}
        	else{
        		reject('player full')
        	}
	        


    });
}



function loadVideos(){
	
	var _playerInitiated = false;
	_playerIsReady = false;
	shell.exec('sudo pkill fbi 2> /dev/null');
	shell.exec("fbi --noverbose -T 1 -t 30 ./black.jpg" );
	shell.exec('sudo find . -name "*-rotated.jpg" -type f -delete');
	shell.exec('clear');
	console.log('loading videos')
	_vidsLoaded=0;
	
	videoString = new arraylist;
	var _thisPath = '';//home/pi/videoloop/'+_thisVid;
	var selectedPath = '';

	try{
		for(var i = 0; i < videolist.length; i++){
			_rndNum = (Math.floor(Math.random() * (videolist.length-1)) + 1);
			_thisVid = [videolist.get(_rndNum)];
			//console.log('_thisVid #'+_rndNum+' : ' + _thisVid)
			
			if ((_thisVid.length>0) && (!_playerIsReady)){
				_thisPath = '/home/pi/videoloop/'+_thisVid;
				if (_vidsLoaded <= _numVidstoLoad){
					var addVideoPromise = AddVideoCheck(_thisPath);
				    addVideoPromise.then(function(result) {
				        //
				        if (result == 'complete'){
				        	
							if (!(_playerInitiated)){
								console.log('moving to player => ' + _playerIsReady)
								_playerInitiated = true;
								playVids(videoString); 
							}
				        }
				        else{
				        	console.log(result);
				        }
				        
				    }, function(err) {
				    	console.log('something went wrong');
				        console.log(err);
				    })
				}
			}
		}
	}
	catch(ex){
		console.log('Error was encountered:', ex);
	}
	finally{

	}

}


//var omx = require('omxdirector');
//omx.play(videoString, {loop: true });
function playVids(theseVideos){
	
	var _currPlayingVid = 0;
	
	delay(300).then(() => {//

		var _thisVideo;
		var _thisVideoRes;
		var _thisVideoW;
		var _thisVideoH;
		var _cmd = '';
		var _thisVidStartPos="00:00:00";
		var _thisVidScreenSize=' --win "0 0 800 480" ';
		
		try {
			_thisVideo = theseVideos[0].split('|');
			_thisVideoRes = _thisVideo[2].split('x');
			_thisVideoW = _thisVideoRes[0]
			_thisVideoH = _thisVideoRes[1]
			if (_thisVideoH >_thisVideoW){ _thisVidScreenSize=' --win "250 0 480 800" ';}

	       	if (_thisVideo[1] > 20) { _thisVidStartPos = "00:00:15";} else{ _thisVidStartPos="00:00:00" }
			_cmd = 'omxplayer -l ' + _thisVidStartPos + ' -o hdmi  ' + _thisVidScreenSize + _thisVideo[0]
			console.log('starting video - ' +_cmd);
			shell.exec(_cmd); 
				
	    } 
	    catch (ex) { console.log('Error playing video:', ex); } 
	    finally { shell.exec('sudo pkill omxplayer');  }

	    try {
			_thisVideo = theseVideos[1].split('|');
			_thisVideoRes = _thisVideo[2].split('x');
			_thisVideoW = _thisVideoRes[0]
			_thisVideoH = _thisVideoRes[1]
			if (_thisVideoH >_thisVideoW){ _thisVidScreenSize=' --win "250 0 480 800" ';}

			if (_thisVideo[1] > 20) { _thisVidStartPos = "00:00:15";} else{ _thisVidStartPos="00:00:00" }
			_cmd = 'omxplayer -l ' + _thisVidStartPos + ' -o both  ' + _thisVidScreenSize + _thisVideo[0]
			console.log('starting video - ' +_cmd);
			shell.exec(_cmd); 
				
	    } 
	    catch (ex) { console.log('Error playing video:', ex); } 
	    finally { shell.exec('sudo pkill omxplayer');  }

	    try {
	       
			_thisVideo = theseVideos[2].split('|');
			_thisVideoRes = _thisVideo[2].split('x');
			_thisVideoW = _thisVideoRes[0]
			_thisVideoH = _thisVideoRes[1]
			if (_thisVideoH >_thisVideoW){ _thisVidScreenSize=' --win "250 0 480 800" ';}

			if (_thisVideo[1] > 20) { _thisVidStartPos = "00:00:15";} else{ _thisVidStartPos="00:00:00" }
			_cmd = 'omxplayer -l ' + _thisVidStartPos + ' -o local  ' + _thisVidScreenSize + _thisVideo[0]
			console.log('starting video - ' +_cmd);
			shell.exec(_cmd); 
	    } 
	    catch (ex) { console.log('Error playing video:', ex); } 
	    finally { shell.exec('sudo pkill omxplayer');  }
		
		/**/
		console.log('playlist complete.')
		loadPhotos();
		
	});
	
}

function playImages(photoString){

	var _img0ResizeAttr = " -fitheight -a";
	var _img1ResizeAttr = " -fitheight -a";
	var _img2ResizeAttr = " -fitheight -a";
	var _img3ResizeAttr = " -fitheight -a";

	var _img0data = "--";
	var _img1data = "--";
	var _img2data = "--";
	var _img3data = "--";

	var _img0err;
	var _img1err;
	var _img2err;
	var _img3err;
	var _isPortrait = false;
	
	shell.cd('/home/pi/videoloop');
	console.log('playing IMAGE loop');
	shell.exec('sudo pkill fbi 2>/dev/null');
	shell.exec("fbi --noverbose -T 1 -t 15 ./black.jpg");// -a

	try {
	        new ExifImage({ image : photoString[0] }, function (error, exifData0) {
				dimensions = sizeOf(photoString[0]);
				//if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img0ResizeAttr = "-fitwidth" }
				if (dimensions.width>dimensions.height) { _img0ResizeAttr = " -fitwidth" }
				if (exifData0 !=null){	
					if (exifData0.image.Orientation != 1) { rewriteImagebyOrientation(exifData0,0); _img0ResizeAttr = " -fitheight"; } 
				}
				else if (dimensions.height>dimensions.width) { 
					rewriteImageby90Degrees(0);
				}
				_img0err = error +'.0';

		    });
        	//	console.log('Video too long. Ignored')
	

			delay(200).then(() => {//
				
		    	new ExifImage({ image : photoString[1] }, function (error, exifData1) {
					dimensions = sizeOf(photoString[1]);
					//if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img1ResizeAttr = "-fitwidth" }
					if (dimensions.width>dimensions.height) { _img1ResizeAttr = " -fitwidth" }
					if (exifData1 !=null){	
						if (exifData1.image.Orientation != 1) { rewriteImagebyOrientation(exifData1,1); _img1ResizeAttr = " -fitheight ";}
					}
					else if (dimensions.height>dimensions.width) { 
						rewriteImageby90Degrees(1);
					}
					_img1err = error +'.1';
			    });

			    new ExifImage({ image : photoString[2] }, function (error, exifData2) {
						dimensions = sizeOf(photoString[2]);
						//if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img2ResizeAttr = "-fitwidth" }
						if (dimensions.width>dimensions.height) { _img2ResizeAttr = " -fitwidth" }
						if (exifData2 !=null){
							if (exifData2.image.Orientation != 1) { rewriteImagebyOrientation(exifData2,2); _img2ResizeAttr = " -fitheight ";}
						}
						else if (dimensions.height>dimensions.width) { 
							rewriteImageby90Degrees(2);
						}
						_img2err = error +'.2';
				    });
			

			}) ; 

			delay(400).then(() => {

			    	new ExifImage({ image : photoString[3] }, function (error, exifData3) {
						dimensions = sizeOf(photoString[3]);
						//if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img3ResizeAttr = "-fitwidth" }
						if (dimensions.width>dimensions.height) { _img3ResizeAttr = " -fitwidth" }

						if (exifData3 !=null){
							if (exifData3.image.Orientation != 1) { rewriteImagebyOrientation(exifData3,3); _img3ResizeAttr = " -fitheight ";} 
						}
						else if (dimensions.height>dimensions.width) { 
							rewriteImageby90Degrees(3);
						}
						_img3err = error +'.3';
				    });
		 	});

	} catch (ex) {
        //console.log('Error encountered:', selectedPath + ex);
        //shell.cd('sh reset.sh');
    } finally {
       
       
    }



	delay(1000).then(() => {//

			try {
				
				console.log("\r\n0: ORIENTATION: " + _img0data + ' -- ' + photoString[0] + '\r\n' + _img0err);// + ' -- ' + dimensions.width + ' x ' + dimensions.height);
				var _cmd = "sudo fbi '" + photoString[0] + "' " + _img0ResizeAttr  + " -a -T 1 -t 5 " + photoString[0];  //--noverbose
				shell.exec(_cmd);// 2>/dev/null");// --noverbose        
		    } catch (ex) {
		        console.log('Error playing video:', ex);
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
		        console.log('Error playing video:', ex);
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
			        //console.log('Error encountered:', selectedPath + ex);
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
				        //console.log('Error encountered:', selectedPath + ex);
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
					        //console.log('Error encountered:', selectedPath + ex);
					        //shell.cd('sh reset.sh');
					    } finally {
					       
					       
					    }
						
					});
					
				});	
					
			})
		});;
		
	});
	


}


function rewriteImageby90Degrees(slot){

	//_thisExifData
	shell.exec("convert " + photoString[slot] + " -rotate 90 " + photoString[slot].replace(".jpg","-rotated.jpg"));
	photoString[slot] = photoString[slot].replace(".jpg","-rotated.jpg");
}

function rewriteImagebyOrientation(_thisExifData, slot){

	//_thisExifData

	if (_thisExifData.image.Orientation == 6) {
		shell.exec("convert " + photoString[slot] + " -rotate 90 " + photoString[slot].replace(".jpg","-rotated.jpg"));
		photoString[slot] = photoString[slot].replace(".jpg","-rotated.jpg");
	}
	else if (_thisExifData.image.Orientation == 3) {
		shell.exec("convert " + photoString[slot] + " -rotate 180 " + photoString[slot].replace(".jpg","-rotated.jpg"));
		photoString[slot] = photoString[slot].replace(".jpg","-rotated.jpg");
	}
	else if (_thisExifData.image.Orientation == 8) {
		shell.exec("convert -resize 480x800 " + photoString[slot] + " -rotate 270 " + photoString[slot].replace(".jpg","-rotated.jpg"));
		photoString[slot] = photoString[slot].replace(".jpg","-rotated.jpg");
	}
}

function toggleDisplayType(){
	console.log('restarting cycle.')

	loadVideos();

}



loadVideos();
//loadPhotos();


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
var _numVidstoLoad = 3;
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

	shell.exec('sudo find . -name "*-rotated.jpg" -type f -delete');

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
		        	if ((_duration > 1) && (_duration < 63)){
		        		

						if ((_vidsLoaded >= _numVidstoLoad) && (!_playerIsReady)){ 
			        		
			        		_playerIsReady = true;
			        		console.log('moving to player => ' + _playerIsReady)
							playVids(videoString); 
							return false; 
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
		       //console.log('Error encountered:', selectedPath + ex);
		       //shell.cd('sh reset.sh');
		    } finally {
		        //fs.closeSync(fd);
		    }



		    return 0;
		});

	}
	
	
}

function loadVideos(){
	
	_playerIsReady = false;

	shell.exec('sudo pkill fbi 2> /dev/null');
	//shell.exec("fbi --noverbose -T 1 -t 30 ./black.jpg" );
	//shell.exec('sudo find . -name "*-rotated.jpg" -type f -delete');
	shell.exec('clear');
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

function getRandomStart(duration){

	var _startPoint = getRandomInt(2,(duration - 10));
	return "00:00:" + _startPoint;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//var omx = require('omxdirector');
//omx.play(videoString, {loop: true });
function playVids(theseVideos){
	
	var _currPlayingVid = 0;
	
	delay(300).then(() => {//

		var _thisVideo;
		var _cmd = '';
		var _thisVidStartPos="00:00:00";
		var _thisVidScreenSize=' --win "0 0 800 480" '
	
		try {
			_thisVideo = theseVideos[0].split('|');

			if (_thisVideo[1] > 15) { _thisVidStartPos=getRandomStart(_thisVideo[1]); }
			_cmd = 'omxplayer -l ' + _thisVidStartPos + ' -o hdmi  ' + _thisVidScreenSize + _thisVideo[0]
			console.log('starting video - ' +_cmd);
			shell.exec(_cmd); 
				
	    } catch (ex) {
	    	shell.exec('sudo pkill omxplayer'); 
	        console.log('Error playing video:', ex);
	        console.log('playlist short.')
			loadVideos();
	        //shell.cd('sh reset.sh');
	    } finally {

	    		try {
					_thisVideo = theseVideos[1].split('|');
					

					if (_thisVideo[1] > 15) { _thisVidStartPos=getRandomStart(_thisVideo[1]); }
					_cmd = 'omxplayer -l ' + _thisVidStartPos + ' -o both  ' + _thisVidScreenSize + _thisVideo[0]
					console.log('starting video - ' +_cmd);
					shell.exec(_cmd); 
						
			    } catch (ex) {
			    	shell.exec('sudo pkill omxplayer'); 
			        console.log('Error playing video:', ex);
			        console.log('playlist short.')
					loadVideos();
			        //shell.cd('sh reset.sh');
			    } finally {

			    	try {
	       
						_thisVideo = theseVideos[2].split('|')
						if (_thisVideo[1] > 15) { _thisVidStartPos=getRandomStart(_thisVideo[1]); }
						_cmd = 'omxplayer -l ' + _thisVidStartPos + ' -o local  ' + _thisVidScreenSize + _thisVideo[0]
						console.log('starting video - ' +_cmd);
						shell.exec(_cmd); 
				    } catch (ex) {
				    	shell.exec('sudo pkill omxplayer'); 
				        console.log('Error playing video:', ex);
				        console.log('playlist short.')
						//	loadVideos();
				        //shell.cd('sh reset.sh');
				    } finally {
				       	console.log('playlist complete.')
						loadPhotos();
					
				    }
			       
			    }
	       
	    }

	    

	    
		
		/**/
		
	});
	
}

function playImages(photoString){

	var _img0ResizeAttr = " -a";
	var _img1ResizeAttr = " -a";
	var _img2ResizeAttr = " -a";
	var _img3ResizeAttr = " -a";


	var _img0err;
	var _img1err;
	var _img2err;
	var _img3err;
	var _isPortrait = false;
	
	shell.cd('/home/pi/videoloop');
	console.log('playing IMAGE loop');
	

	try {
	        new ExifImage({ image : photoString[0] }, function (error, exifData0) {
				dimensions = sizeOf(photoString[0]);
				if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img0ResizeAttr = "-fitwidth" }
				if (exifData0 !=null){	
					if (exifData0.image.Orientation != 1) { rewriteImagebyOrientation(exifData0,0); } 
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
					if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img1ResizeAttr = "-fitwidth" }
					if (exifData1 !=null){	
						if (exifData1.image.Orientation != 1) { rewriteImagebyOrientation(exifData1,1); }
					}
					else if (dimensions.height>dimensions.width) { 
						rewriteImageby90Degrees(1);
					}
					_img1err = error +'.1';
			    });

			    new ExifImage({ image : photoString[2] }, function (error, exifData2) {
						dimensions = sizeOf(photoString[2]);
						if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img2ResizeAttr = "-fitwidth" }
						if (exifData2 !=null){
							if (exifData2.image.Orientation != 1) { rewriteImagebyOrientation(exifData2,2); }
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
						if ((dimensions.width <1000) || (dimensions.height <750) || (dimensions.width>dimensions.height)) { _img3ResizeAttr = "-fitwidth" }
						if (exifData3 !=null){
							if (exifData3.image.Orientation != 1) { rewriteImagebyOrientation(exifData3,3); } 
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



	delay(200).then(() => {//

		try {
		
			shell.exec('sudo pkill fbi 2>/dev/null');
			shell.exec("fbi --noverbose -T 1 -t 15 ./black.jpg");// -a
			//console.log("\r\n0: ORIENTATION: " + ' -- ' + photoString[0] + '\r\n' + _img0err);// + ' -- ' + dimensions.width + ' x ' + dimensions.height);
			shell.exec('sudo pkill fbi 2>/dev/null');
			//var _cmd = "sudo fbi --autozoom --noverbose --vt 1 '" + photoString[0] + "' " + _img0ResizeAttr  + " -a -T 1 -t 5 -d " + photoString[0];
			//shell.exec(_cmd);// 2>/dev/null");// --noverbose        
      
      		var _cmd = "sudo fbi " + _img0ResizeAttr  + " --autozoom --noverbose --vt 1  -a -T 1 -t 5 '" + photoString[0] + "'";  //--noverbose
				shell.exec(_cmd);// 2>/dev/null");// --noverbose 
			shell.exec(_cmd);// 2>/dev/null");// --noverbose 
        
	    } catch (ex) {
	        console.log('Error playing image:', ex);
	        //shell.cd('sh reset.sh');
	    } finally {
	       
	    }

		
	}).then(() => {//
		
		delay(4000).then(() => {//

			try {
	       
				shell.exec('sudo pkill fbi 2>/dev/null');
				//console.log("\r\n0: ORIENTATION: " + ' -- ' + photoString[1] + '\r\n' + _img1err);// + ' -- ' + dimensions.width + ' x ' + dimensions.height);
				var _cmd = "sudo fbi " + _img1ResizeAttr  + " --autozoom --noverbose --vt 1  -a -T 1 -t 5 '" + photoString[1] + "'";  //--noverbose
				shell.exec(_cmd);// 2>/dev/null");// --noverbose 
        
		    } catch (ex) {
		        console.log('Error playing image:', ex);
		        //shell.cd('sh reset.sh');
		    } finally {
		       
		    }
			
		}).then(() => {//

			delay(4000).then(() => {//

				try {
			        shell.exec('sudo pkill fbi 2>/dev/null');
					//console.log("\r\n0: ORIENTATION: " + ' -- ' + photoString[2] + '\r\n' + _img2err );// + ' -- ' + dimensions.width + ' x ' + dimensions.height);
					var _cmd = "sudo fbi " + _img2ResizeAttr  + " --autozoom --noverbose --vt 1  -a -T 1 -t 5 '" + photoString[2] + "'";
					shell.exec(_cmd);// 2>/dev/null");// --noverbose 
        

			    } catch (ex) {
			        //console.log('Error encountered:', selectedPath + ex);
			        //shell.cd('sh reset.sh');
			    } finally {
			       
			       
			    }

				
			}).then(() => {//
					
				delay(4000).then(() => {//

					try {
				        shell.exec('sudo pkill fbi 2>/dev/null');
						//console.log("\r\n0: ORIENTATION: " + ' -- ' + photoString[3] + '\r\n' + _img3err );// + ' -- ' + dimensions.width + ' x ' + dimensions.height);
						//shell.exec("sudo fbi  --autozoom --noverbose --vt 1 '" + photoString[3] + "' " + _img3ResizeAttr  + " -a -T 1 -t 5 -d " + photoString[3]);// + " 2>/dev/null");// --noverbose 
						var _cmd = "sudo fbi " + _img3ResizeAttr  + "  --autozoom --noverbose --vt 1 -a -T 1 -t 5 '" + photoString[3] + "'";
						shell.exec(_cmd);// 2>/dev/null");// --noverbose 
							
				    } catch (ex) {
				        //console.log('Error encountered:', selectedPath + ex);
				        //shell.cd('sh reset.sh');
				    } finally {
				       
				       
				    }

					
				}).then(() => {//
					
					delay(4000).then(() => {//

						try {
					        shell.exec('sudo pkill fbi 2>/dev/null');
							//shell.exec('sudo find . -name "*-rotated.jpg" -type f -delete');
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



//loadPhotos();
loadVideos();
//shell.exec('clear');


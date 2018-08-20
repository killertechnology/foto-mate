


const PATH = require('path');
const dirTree = require('directory-tree');
var arraylist = require("arraylist")
var list = new arraylist;
var videoString  = new arraylist;

const tree = dirTree('./Video/', {extensions:/\.*$/}, (item, PATH) => {
    //console.log(item.path);

	list.add([item.path]);
    //videoString+= "'" + item.path + "',";
    //console.log('*****')
});

var _rndNum = (Math.floor(Math.random() * 2) + 1);
for(var i = 0; i < 50; i++){
	_rndNum = (Math.floor(Math.random() * (list.length-1)) + 1);
	videoString.add([list.get(_rndNum)])
}



var omx = require('omxdirector');
omx.play(videoString, {loop: true });
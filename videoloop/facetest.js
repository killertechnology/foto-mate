const face = require('face-detector')
 
var imagePath = './20140429_201722.jpg'
 
face.detect(imagePath,function(result){
  console.log(result)
 
})
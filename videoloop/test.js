
var Promise = require('promise');

function makePromiseForDuration(input) {
    return new Promise(function(resolve, reject) {
        // some async operation here
        resolve(input + 10);
    });
}

makePromiseForDuration(29).then(function(val) {
   // you access the value from the promise here
   log(val);
});

// display output in snippet
function log(x) {
    console.log(x);
}
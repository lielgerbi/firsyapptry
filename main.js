const config = require('./config.js');
const express = require('express');
const app = express();
var fs = require("fs");
const request = require('request');
console.log(`NODE_ENV=${config.NODE_ENV}`);
console.log("Going to send server all file in folder " +config.DIR );

app.listen(config.PORT, () => {
  console.log(`Example app listening at http://localhost:${config.PORT}`)
});
var data = {};
//read file in dir path and res him
readFiles(config.DIR, function(filename, content) {
data[filename] = content;
app.get('/', (req, res) => {
        sendfiles();
        res.send(data);
        return data;
      });
}, function(err) {
  throw err;
});

//Every 10 seconds calls a function that communicates with the other server
//http://localhost:3001/saveServer
//http://127.0.0.1:3001/saveServer
app.get('/saveServer',  function(req, res) { 
  setInterval(sendfiles, 10000);
  res.end();
});

//Performs communication with the other server
function sendfiles(){
  console.log("sending");
  readFiles(config.DIR, function(filename, content) {
    data[filename] = content;
    //Rename files name to a valid in case of error and delete if errors in sending above the max
    for (var file in data) {
        let fileEnd =file.split('.').pop()
        if((isNaN(fileEnd))==false) {
        fileEnd <= config.MAX_ERROR ? data[file.split('.').slice(0, -1).join('.')] = data[file]: "";
        delete data[file];
        }
    }
    request('https://lielserver.azurewebsites.net', { json: true,  body: data }, (err, res, body) => {
    //  if (err) { return console.log(err); }
    console.log(data)
    }); 
  });

}

app.use(express.json());
app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));

//read all file in dir
function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname +"/"+ filename, 'utf-8', function(err, content) {
        //rename file name in case of error
        if (err) {
          renameFileName(dirname +"/"+ filename);
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

//rename file name in case of error in sending
function renameFileName(path){
  //if file end with number to add or start counting
  if(isNaN(path.split('.').pop())) {
    fs.rename(path,path+".1", function(err) {
      if ( err ) console.log('ERROR: ' + err);
    });
  }
  else{
     let newname = path.split('.').slice(0, -1).join('.');
     let counter = parseInt(path.split('.').pop());
     newname = newname + "." +(counter+1);
    fs.rename(path,newname, function(err) {
      if ( err ) console.log('ERROR: ' + err);
    });
  }
}
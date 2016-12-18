#!/usr/bin/env node
var glob = require("glob");
var azure = require("azure");
var fs = require('fs');
var sasurl = process.env.AE_BLOBSERVICE_SAS_URL
var blobURL = sasurl.substring(0, sasurl.indexOf('?'));
var blobCred = sasurl.substring(sasurl.indexOf('?'));

var uploadFile = function(fileName, containerName, overwrite) {
  var blobService = azure.createBlobService(null, null, blobURL, blobCred);
  blobService.getBlobProperties(containerName, fileName, null, function(error, result, response){
    if(error || overwrite)
    {
      var stats = fs.statSync(fileName);
      var fileSizeInBytes = stats["size"];
      var blobService_upload = azure.createBlobService(null, null, blobURL, blobCred);
      blobService_upload.createBlockBlobFromStream(containerName, fileName, fs.createReadStream(fileName), fileSizeInBytes, function(error, result, response){
        if(error){
            console.log("Couldn't upload file %s", fileName);
            console.error(error);
        } else {
            console.log('File %s uploaded successfully', fileName);
        }
      });
    }
    else {
      console.log("Blob [%s] already exist in container [%s]", fileName, containerName);
    }
  });
}

exports.mput = function(containerName, filePattern, overwrite) {
    console.log(filePattern);
    glob(filePattern, {mark: true}, function (er, files) {
    for(var ix in files)
    {
      var fileName = files[ix];
      if(fs.lstatSync(fileName).isDirectory()) {
        console.log("skipping directory: " + fileName);
      }
      else {
        uploadFile(fileName, containerName, overwrite);
      }
    }
  });
}

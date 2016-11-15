#!/usr/bin/env node
var azure = require("azure");
var fs = require('fs');
var blobURL = "https://appesteemstorage.blob.core.windows.net";
var containerName = 'downloads';

exports.put = function(fileName, blobName) {
  var blobService = azure.createBlobService(null, null, blobURL, process.env.AE_DOWNLOAD_SAS);
  var stats = fs.statSync(fileName);
  var fileSizeInBytes = stats["size"];
  blobService.createBlockBlobFromStream(containerName, blobName, fs.createReadStream(fileName), fileSizeInBytes, function(error, result, response){
    if(error){
        console.log("Couldn't upload file %s", fileName);
        console.error(error);
    } else {
        console.log('File %s uploaded successfully', fileName);
    }
  });
}

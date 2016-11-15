#!/usr/bin/env node
var azure = require("azure");
var fs = require('fs');
var blobURL = "https://appesteemstorage.blob.core.windows.net";
var containerName = 'downloads';

exports.get = function(blobName, fileName) {
  var blobService = azure.createBlobService(null, null, blobURL, process.env.AE_DOWNLOAD_SAS);
  blobService.getBlobToStream(containerName, blobName, fs.createWriteStream(fileName), function(error, result, response){
    if (error) {
        console.error("Couldn't download blob %s", blobName);
        console.error(error);
    } else {
        console.log("Sucessfully downloaded blob %s to %s", blobName, fileName);
      // blob retrieved
    }
  });
}

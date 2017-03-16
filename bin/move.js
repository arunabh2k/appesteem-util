#!/usr/bin/env node
var azure = require("azure");
var fs = require('fs');
var sasurl = process.env.AE_BLOBSERVICE_SAS_URL
var blobURL = sasurl.substring(0, sasurl.indexOf('?'));
var blobCred = sasurl.substring(sasurl.indexOf('?'));
var blobService = azure.createBlobService(null, null, blobURL, blobCred);

exports.move = function(containerName, fromBlobName, toBlobName) {
  var fromBlobUrl = blobService.getUrl(containerName, fromBlobName, null);
  fromBlobUrl += blobCred;
  blobService.startCopyBlob(fromBlobUrl, containerName, toBlobName, null, function(error, result, response){
    if (error) {
        console.error("Couldn't move blob %s (%s)", fromBlobName, fromBlobUrl);
        console.error(error);
    } else {
      blobService.deleteBlob(containerName, fromBlobName, null, function(error, result, response){
        if (error) {
            console.error("Error while processing move operation (copied successfully but failed to delete) %s", fromBlobName);
            console.error(error);
        } else {
          console.log("Sucessfully moved blob %s to %s", fromBlobName, toBlobName);
          // blob moved
        }
      });
    }
  });
}

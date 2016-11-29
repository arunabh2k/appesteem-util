#!/usr/bin/env node
var azure = require("azure");
var fs = require('fs');
var sasurl = process.env.AE_BLOBSERVICE_SAS_URL
var blobURL = sasurl.substring(0, sasurl.indexOf('?'));
var blobCred = sasurl.substring(sasurl.indexOf('?'));
var blobService = azure.createBlobService(null, null, blobURL, blobCred);

exports.del = function(containerName, blobName) {
  blobService.deleteBlob(containerName, blobName, null, function(error, result, response){
    if (error) {
        console.error("Couldn't delete blob %s", blobName);
        console.error(error);
    } else {
        console.log("Sucessfully deleted blob %s", blobName);
      // blob retrieved
    }
  });
}

#!/usr/bin/env node
var azure = require("azure");
var blobURL = "https://appesteemstorage.blob.core.windows.net";
var containerName = 'downloads';
var blobs = [];
var blobService = azure.createBlobService(null, null, blobURL, process.env.AE_DOWNLOAD_SAS);
function aggregateBlobs(err, result, cb) {
    if (err) {
        cb(er);
    } else {
        blobs = blobs.concat(result.entries);
        if (result.continuationToken !== null) {
            blobService.listBlobsSegmented(
                containerName,
                result.continuationToken,
                aggregateBlobs);
        } else {
            cb(null, blobs);
        }
    }
}
exports.dir = function() {
  blobService.listBlobsSegmented(containerName, null, function(err, result) {
      aggregateBlobs(err, result, function(err, blobs) {
          if (err) {
              console.log("Couldn't list blobs");
              console.error(err);
          } else {
              console.log("--------------------------------------------------");
              for(var ix in blobs)
              {
                console.log("|  " + blobs[ix].name);
              }
              console.log("--------------------------------------------------");
          }
      });
  });
}

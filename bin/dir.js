#!/usr/bin/env node
var azure = require("azure");
var blobs = [];
var sasurl = process.env.AE_BLOBSERVICE_SAS_URL
var blobURL = sasurl.substring(0, sasurl.indexOf('?'));
var blobCred = sasurl.substring(sasurl.indexOf('?'));
var blobService = azure.createBlobService(null, null, blobURL, blobCred);

function aggregateBlobs(containerName, err, result, cb) {
    if (err) {
        cb(err);
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
exports.dir = function(containerName) {
  blobService.listBlobsSegmented(containerName, null, function(err, result) {
      aggregateBlobs(containerName, err, result, function(err, blobs) {
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

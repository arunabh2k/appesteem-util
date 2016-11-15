#!/usr/bin/env node
var azure = require("azure");
var blobService = azure.createBlobService(null, null, "https://appesteemstorage.blob.core.windows.net", "?sv=2015-04-05&ss=bfqt&srt=sco&sp=rwdlacup&se=2016-11-30T04:13:06Z&st=2016-11-15T20:13:06Z&spr=https&sig=FBPJQpdNv0vdWKVuNGuZUzTQNtXHShIbo7b6AnmCuxc%3D");
var containerName = 'downloads';
var blobs = [];
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

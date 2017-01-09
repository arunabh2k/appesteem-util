#!/usr/bin/env node
var azure = require("azure");
var fs = require('fs');
var sasurl = process.env.AE_BLOBSERVICE_SAS_URL
var blobURL = sasurl.substring(0, sasurl.indexOf('?'));
var blobCred = sasurl.substring(sasurl.indexOf('?'));
var blobService = azure.createBlobService(null, null, blobURL, blobCred);
var blobs = [];
var mkdirp = require('mkdirp');
const path = require('path');

//different from other, it just match for the directory
function matchRule(str, rule) {
  return new RegExp("^" + rule.split("*").join("((?!/).)*") + "$").test(str);
}

var moveFile = function(containerName, fromBlobName, toBlobName) {
  var fromBlobUrl = blobService.getUrl(containerName, fromBlobName, null);
  blobService.startCopyBlob(fromBlobUrl, containerName, toBlobName, null, function(error, result, response){
    if (error) {
        console.error("Couldn't move blob %s", fromBlobName);
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
exports.mmove = function(containerName, blobPattern, toDir) {
  blobService.listBlobsSegmented(containerName, null, function(err, result) {
      aggregateBlobs(containerName, err, result, function(err, blobs) {
          if (err) {
              console.log("Couldn't move blobs");
              console.error(err);
          } else {
              for(var ix in blobs)
              {
                //match the pattern
                if(matchRule(blobs[ix].name,blobPattern))
                {
                  var idx = blobs[ix].name.lastIndexOf("/");
                  if(toDir[toDir.length - 1] != "/")
                    toDir += "/";
                  var toBlobName = toDir + blobs[ix].name.substring(idx+1);
                  moveFile(containerName, blobs[ix].name, toBlobName);
                }
              }
          }
      });
  });
}

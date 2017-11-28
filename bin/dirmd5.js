#!/usr/bin/env node
var azure = require("azure");
var atob = require('atob');
var blobs = [];
var sasurl = process.env.AE_BLOBSERVICE_SAS_URL
var blobURL = sasurl.substring(0, sasurl.indexOf('?'));
var blobCred = sasurl.substring(sasurl.indexOf('?'));
var blobService = azure.createBlobService(null, null, blobURL, blobCred);

function matchRule(str, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
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
exports.dir = function(containerName, blobPattern) {
  blobService.listBlobsSegmented(containerName, null, function(err, result) {
      aggregateBlobs(containerName, err, result, function(err, blobs) {
          if (err) {
              console.log("Couldn't list blobs");
              console.error(err);
          } else {
              for(var ix in blobs)
              {
                  var bytearray = atob(blobs[ix].contentSettings.contentMD5);
                  var md5 = "";
                  for(var i = 0; i < bytearray.length; i++) {
                      md5 += ('0' + bytearray.charCodeAt(i).toString(16)).slice(-2);
                  }
                if(!blobPattern || blobPattern == "")
                {
                  console.log(blobs[ix].name + "|" + md5);
                }
                else if(blobPattern && matchRule(blobs[ix].name,blobPattern))
                {
                  console.log(blobs[ix].name + "|" + md5);
                }
              }
          }
      });
  });
}

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
exports.mget = function(containerName, blobPattern) {
  blobService.listBlobsSegmented(containerName, null, function(err, result) {
      aggregateBlobs(containerName, err, result, function(err, blobs) {
          if (err) {
              console.log("Couldn't download blobs");
              console.error(err);
          } else {
              for(var ix in blobs)
              {
                //match the pattern
                if(matchRule(blobs[ix].name,blobPattern))
                {
                  var blobName = blobs[ix].name;
                  var dirName = path.dirname(blobName);
                  mkdirp.sync(dirName);
                  var get = require("./get.js");
                  get.get(containerName, blobName, blobName);
                }
              }
          }
      });
  });
}

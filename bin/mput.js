#!/usr/bin/env node
var glob = require("glob");
var azure = require("azure");
var fs = require('fs');
var sasurl = process.env.AE_BLOBSERVICE_SAS_URL
var blobURL = sasurl.substring(0, sasurl.indexOf('?'));
var blobCred = sasurl.substring(sasurl.indexOf('?'));
var blobService = azure.createBlobService(null, null, blobURL, blobCred);

exports.mput = function(containerName, filePattern, overwrite) {
    console.log(filePattern);
    glob(filePattern, {mark: true}, function (er, files) {
    for(var ix in files)
    {
      var fileName = files[ix];
      blobService.getBlobProperties(containerName, fileName, null, function(error, result, response){
        if(error || overwrite)
        {
          var put = require("./put.js");
          put.put(containerName, fileName, fileName);
        }
        else {
          console.log("Blob [%s] already exist in container [%s]", fileName, containerName);
        }
      });
      //console.log("-----:" + files[ix])
      /*
      */
    }
  });
}

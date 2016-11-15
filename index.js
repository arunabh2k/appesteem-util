#!/usr/bin/env node

if(!process.env.AE_DOWNLOAD_SAS)
{
  console.log(" ");
  console.log("Please set environment variable 'AE_DOWNLOAD_SAS' to SAS token provided");
  console.log(" ");
  return;
}

var command = "help";
var blobName = null;
var fileName = null;
var check_command = function(val) {
  if(val.toLowerCase() == "get")
  {
    command = "get";
  }
  else if(val.toLowerCase() == "put")
  {
    command = "put";
  }
  if(val.toLowerCase() == "dir")
  {
    command = "dir";
  }
  if(val.toLowerCase() == "test")
  {
    command = "test";
  }
}

process.argv.forEach(function (val, index, array) {
  if(index == 2)
  {
    check_command(val);
  }
  if(index == 3)
  {
    if(command == "put")
      fileName = val;
    else
      blobName = val;
  }
  if(index == 4)
  {
    if(command == "put")
      blobName = val;
    else
      fileName = val;
  }
});

if(command == "get" && blobName != null && fileName != null)
{
  var get = require("./bin/get.js");
  get.get(blobName, fileName);
}
else if(command == "put" && blobName != null && fileName != null)
{
  var put = require("./bin/put.js");
  put.put(fileName, blobName);
}

else if(command == "dir")
{
  var dir = require("./bin/dir.js");
  dir.dir();
}
else
{
  console.log("Please use following commands:");
  console.log("appesteem-util get <blob path as listed in dir>  <path of download file> (download blob)");
  console.log("appesteem-util put <path of file to upload> <blob path> (upload blob)");
  console.log("appesteem-util dir (list blob)");
}

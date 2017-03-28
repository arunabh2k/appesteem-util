#!/usr/bin/env node

if(!process.env.AE_BLOBSERVICE_SAS_URL)
{
  console.log(" ");
  console.log("Please set environment variable 'AE_BLOBSERVICE_SAS_URL' to Blob service SAS URL");
  console.log(" ");
  return;
}

var command = "help";
var blobName = null;
var fileName = null;
var fromBlobName = null;
var toBlobName = null;
var containerName = null;
var overwrite = false;
var descend = false;
var check_command = function(val) {
  if(val.toLowerCase() == "mget")
  {
    command = "mget";
  }
  else if(val.toLowerCase() == "mput")
  {
    command = "mput";
  }
  if(val.toLowerCase() == "get")
  {
    command = "get";
  }
  else if(val.toLowerCase() == "put")
  {
    command = "put";
  }
  if(val.toLowerCase() == "del")
  {
    command = "del";
  }
  if(val.toLowerCase() == "move")
  {
    command = "move";
  }
  if(val.toLowerCase() == "dir")
  {
    command = "dir";
  }
  if(val.toLowerCase() == "mmove")
  {
    command = "mmove";
  }
  if(val.toLowerCase() == "test")
  {
    command = "test";
  }
}

process.argv.forEach(function (val, index, array) {
  if(val == "--overwrite")
  {
    overwrite = true;
  }
  if(val == "--descend")
  {
    descend = true;
  }

  if(index == 2)
  {
    containerName = val;
  }
  if(index == 3)
  {
    check_command(val);
  }
  if(index == 4)
  {
    if(command == "put" || command == "mput")
      fileName = val;
    else if(command == "move" || command == "mmove")
      fromBlobName = val;
    else
      blobName = val;
  }
  if(index == 5)
  {
    if(command == "get" || command == "mget")
      fileName = val;
    if(command == "put")
      blobName = val;
    else if(command == "move" || command == "mmove")
      toBlobName = val;
  }
});

if(command == "mget" && containerName != null && blobName != null)
{
  var mget = require("./bin/mget.js");
  mget.mget(containerName, blobName);
}
else if(command == "mput" && containerName != null && fileName != null)
{
  var mput = require("./bin/mput.js");
  mput.mput(containerName, fileName, overwrite, descend);
}
else if(command == "get" && containerName != null && blobName != null && fileName != null)
{
  var get = require("./bin/get.js");
  get.get(containerName, blobName, fileName);
}
else if(command == "put" && containerName != null && blobName != null && fileName != null)
{
  var put = require("./bin/put.js");
  put.put(containerName, fileName, blobName);
}
else if(command == "del" && containerName != null && blobName != null)
{
  var del = require("./bin/del.js");
  del.del(containerName, blobName);
}
else if(command == "move" && containerName != null && fromBlobName != null && toBlobName != null)
{
  var move = require("./bin/move.js");
  move.move(containerName, fromBlobName, toBlobName);
}
else if(command == "mmove" && containerName != null && fromBlobName != null && toBlobName != null)
{
  var mmove = require("./bin/mmove.js");
  mmove.mmove(containerName, fromBlobName, toBlobName);
}
else if(command == "dir" && containerName != null)
{
  var dir = require("./bin/dir.js");
  dir.dir(containerName, blobName);
}
else
{
  console.log("Please use following commands:");
  console.log("aeutil <container name> mget <blob name pattern to get> (download blobs)");
  console.log("aeutil <container name> mput <path pattern of file to upload> [--overwrite optional for existing blob --descend optional to recurse dirs] (upload blobs)");
  console.log("aeutil <container name> mmove <blob name pattern to get <to blob dir path> (move blob)");
  console.log("aeutil <container name> get <blob path as listed in dir>  <path of download file> (download blob)");
  console.log("aeutil <container name> put <path of file to upload> <blob path> (upload blob)");
  console.log("aeutil <container name> del <path of blob to delete> (delete blob)");
  console.log("aeutil <container name> move <from blob path> <to blob path> (move blob)");
  console.log("aeutil <container name> dir [blob pattern(optional)] (list blob)");
}

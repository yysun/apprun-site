#!/usr/bin/env node

var liveServer = require("live-server");

var params = {
	"port": 8080,
	"root": "public",
	"file": "index.html",
	"logLevel": 2
}

liveServer.start(params);

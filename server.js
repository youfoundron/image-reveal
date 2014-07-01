var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var cache = {};

// Handles 404 errors
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

// Serves file data
function sendFile(response, filePath, fileContents) {
  response.writeHead(200, {"content-type": mime.lookup(path.basename(filePath))} );
  response.end(fileContents);
}

// Cache's static files and serves files from memory
function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {                            // Check if file is cached in memory
    sendFile(response, absPath, cache[absPath]);   // Serve file from memory
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {                                // Check if file exists on disk
        fs.readFile(absPath, function(err, data) { // Read file from disk
          if (err) {
            send404(response);                     // Should report error here...
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);     // Serve file read from disk
          }
        });
      } else {
        send404(response);                         // Send 404 if file not found
      }
    });
  }
}

var server = http.createServer(function(request, response) {	// Create HTTP server
	var filePath = false;
	if (request.url == "/") {
		filePath = "public/index.html"; 	  // Determine HTML file to be served by default
	} else {
		filePath = "public" + request.url; // Translate URL path to relative file path
	}
	var absPath = "./" + filePath; 			 // Prepend "./" to avoid relative path confusion
	serveStatic(response, cache, absPath);
});

// start the server
server.listen(3000, function() {
  console.log("Server listening on port 3000.");
});

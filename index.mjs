/**
 * Primary API file
 */

// Dependencies
import http from "http";
import url from "url";

// The server should respond to all the request with string
const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path from the URL
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Send the response
  res.end("Hello world!\n");

  // Log the request path
  console.log("Request is received on path: " + trimmedPath);
});

// The server should listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});

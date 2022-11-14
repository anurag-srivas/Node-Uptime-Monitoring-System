/**
 * Primary API file
 */

// Dependencies
import http from "http";

// The server should respond to all the request with string
const server = http.createServer((req, res) => {
  res.end("Hello world!\n");
});

// The server should listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});

/**
 * Primary API file
 */

// Dependencies
import http from "http";
import url from "url";
import { StringDecoder } from "string_decoder";

// The server should respond to all the request with string
const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path from the URL
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the header as an object
  const headers = req.headers;

  // Get the payload, if there is any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Choose the request where it should go to. If the request is not found then it should call the not found handler
    const chooseHandler =
      typeof routers[trimmedPath] !== "undefined"
        ? routers[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };

    // Route the request to the handler specified in the routers
    chooseHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      // Use the payload called back by the handler, or default to empty object
      payload = typeof payload === "object" ? payload : {};

      // Convert the payload to string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the response
      console.log("Response ", statusCode, payloadString);
    });
  });
});

// The server should listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});

// Define the handler
const handlers = {};

// Sample handler
handlers.sample = (data, callbackFn) => {
  callbackFn(406, { name: "Sample handler" });
};

// Not found handler
handlers.notFound = (data, callbackFn) => {
  callbackFn(404);
};

// Define the request routers
const routers = {
  sample: handlers.sample,
};

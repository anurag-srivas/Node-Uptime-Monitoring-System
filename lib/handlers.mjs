/**
 * Request handlers
 */

// Dependencies
import _data from "./data.mjs";
import helpers from "./helpers.mjs";

// Define the handler
const handlers = {};

// Users handler
handlers.users = (data, callbackFn) => {
  const acceptedMethods = ["post", "get", "put", "delete"];
  if (acceptedMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callbackFn);
  }
};

// Container for the users submethod handlers
handlers._users = {};

// Users post handler
// Requied data : firstName, lastName, phone, password, tosAgreement
// Optional data : None
handlers._users.post = (data, callbackFn) => {
  // Check all the required fields are filled out
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof data.payload.phone === "number" &&
    data.payload.phone.toString().trim().length === 10
      ? data.payload.phone
      : false;
  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  const tosAgreement =
    typeof data.payload.tosAgreement === "boolean" &&
    data.payload.tosAgreement === true
      ? true
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure user does not already exist
    _data.read("users", phone, (err, data) => {
      if (err) {
        // Hash the password
        const hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          // Create the user object
          const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement,
          };

          // Store the user
          _data.create("users", phone, userObject, (err) => {
            if (!err) {
              callbackFn(200);
            } else {
              console.log(err);
              callbackFn(500, { error: "Could not create a new user" });
            }
          });
        } else {
          callbackFn(500, { error: "Could not create the hashed password" });
        }
      } else {
        callbackFn(400, {
          error: "Requested user with the phone number is already exist",
        });
      }
    });
  } else {
    callbackFn(400, { error: "Missing required fields" });
  }
};

// Users get handler
// Required fields: phone
// Optional fields: None
handlers._users.get = (data, callbackFn) => {
  // Check that phone number is valid
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;

  if (phone) {
    // Lookup the user by phone number
    _data.read("users", phone, (err, data) => {
      if ((!err, data)) {
        // Remove the password from the Response
        delete data.hashedPassword;
        callbackFn(200, data);
      } else {
        callbackFn(404, { error: "User is not found" });
      }
    });
  } else {
    callbackFn(400, { error: "Missing required field" });
  }
};

// Users put handler
handlers._users.put = (data, callbackFn) => {
  callbackFn(200);
};

// Users delete handler
handlers._users.delete = (data, callbackFn) => {
  callbackFn(200);
};

// Ping handler
handlers.ping = (data, callbackFn) => {
  callbackFn(200);
};

// Not found handler
handlers.notFound = (data, callbackFn) => {
  callbackFn(404);
};

// Export the module
export default handlers;

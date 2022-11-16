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
// Required field: phone
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
// Required field: phone
// Optional fields: firstName, lastName, password (at least one must be specified)
handlers._users.put = (data, callbackFn) => {
  // Check the required field
  const phone =
    typeof data.payload.phone === "number" &&
    data.payload.phone.toString().trim().length === 10
      ? data.payload.phone
      : false;

  // Check the optional fields
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
  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      // Lookup the user by phone number
      _data.read("users", phone, (err, userData) => {
        if ((!err, userData)) {
          userData.firstName = firstName ? firstName : userData.firstName;
          userData.lastName = lastName ? lastName : userData.lastName;
          userData.hashedPassword = password
            ? helpers.hash(password)
            : userData.password;

          // Store the new updates
          _data.update("users", phone, userData, (err) => {
            if (!err) {
              callbackFn(200);
            } else {
              callbackFn(500, { error: "Could not update the user" });
            }
          });
        } else {
          callbackFn(404, { error: "User is not found" });
        }
      });
    } else {
      callbackFn(400, { error: "Missing required field or fields to update" });
    }
  } else {
    callbackFn(400, { error: "Missing required field" });
  }
};

// Users delete handler
// Required field: phone
// Optional fields: None
handlers._users.delete = (data, callbackFn) => {
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
        _data.delete("users", phone, (err) => {
          if (!err) {
            callbackFn(200);
          } else {
            callbackFn(500, {
              error: "Error occurred while deleting the user",
            });
          }
        });
      } else {
        callbackFn(404, { error: "User is not found" });
      }
    });
  } else {
    callbackFn(400, { error: "Missing required field" });
  }
};

// Token handler
handlers.tokens = (data, callbackFn) => {
  const acceptedMethods = ["post", "get", "put", "delete"];
  if (acceptedMethods.indexOf(data.method) > -1) {
    handlers._token[data.method](data, callbackFn);
  }
};

// Container tokens submethod handler
handlers._token = {};

// Token post handler
// Required fields: phone and password
// Optional field: none
handlers._token.post = (data, callbackFn) => {
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

  if (phone && password) {
    _data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        // Hash the sent password and compare it with the password stored in the user object
        const hashedPassword = helpers.hash(password);
        if (hashedPassword === userData.hashedPassword) {
          // if valid, create a new token with random name and set the expiration time for 1 hour
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            id: tokenId,
            phone,
            expires,
          };

          // Store the token
          _data.create("tokens", tokenId, tokenObject, (err) => {
            if (!err) {
              callbackFn(200, tokenObject);
            } else {
              callbackFn(500, { error: "Error occurred in creating a token" });
            }
          });
        } else {
          callbackFn(403, { error: "Invalid credentials" });
        }
      } else {
        callbackFn(400, { error: "User is not found" });
      }
    });
  } else {
    callbackFn(400, { error: "Missing required field(s)" });
  }
};

// Token get handler
// Required field: id
// Optional fiels: None
handlers._token.get = (data, callbackFn) => {
  // Check that token ID is valid
  const id =
    typeof data.queryStringObject.id === "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;

  if (id) {
    // Lookup the token by ID
    _data.read("tokens", id, (err, data) => {
      if ((!err, data)) {
        callbackFn(200, data);
      } else {
        callbackFn(404, { error: "Token is not found" });
      }
    });
  } else {
    callbackFn(400, { error: "Missing required field" });
  }
};

// Token put handler
// Required fields: id and extend
// Optional fields: None
handlers._token.put = (data, callbackFn) => {
  const id =
    typeof data.payload.id === "string" && data.payload.id.trim().length === 20
      ? data.payload.id.trim()
      : false;
  const extend =
    typeof data.payload.extend === "boolean" && data.payload.extend === true
      ? true
      : false;

  if (id && extend) {
    // Look up the token
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        // Check to make sure that the token is not already expired
        if (tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          // Store the new updates
          _data.update("tokens", id, tokenData, (err) => {
            if (!err) {
              callbackFn(200);
            } else {
              callbackFn(500, {
                error: "Error in extending the expiration time of the token",
              });
            }
          });
        } else {
          callbackFn(403, {
            error: "Token is already expired and cannot be extended",
          });
        }
      } else {
        callbackFn(404, { error: "Token is not found" });
      }
    });
  } else {
    callbackFn(400, { error: "Missing required field(s)" });
  }
};

// Token delete handler
handlers._token.delete = (data, callbackFn) => {};

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

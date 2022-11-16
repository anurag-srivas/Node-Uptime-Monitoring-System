/**
 * Library for storing and editing the data
 */

// Dependencies
import fs from "fs";
import path from "path";
import helpers from "./helpers.mjs";

// Container for the module (to be exported)
const lib = {};

// Base directory for the data folder
const __dirname = path.resolve();
lib.baseDir = path.join(__dirname, "/.data/");

// Write data to a file
lib.create = (dir, file, data, callbackFn) => {
  // Open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to string
        const fileData = JSON.stringify(data);

        // Write to a file and close it
        fs.writeFile(fileDescriptor, fileData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callbackFn(false);
              } else {
                callbackFn("Error closing a new file");
              }
            });
          } else {
            callbackFn("Error in writing to a file");
          }
        });
      } else {
        callbackFn("Could not create a new file, it may already exist");
      }
    }
  );
};

// Read the data from a file
lib.read = (dir, file, callbackFn) => {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf-8",
    (err, data) => {
      const parsedData = helpers.parseJsonStringToJsonObject(data);
      if (!err) {
        callbackFn(false, parsedData);
      } else {
        callbackFn(err, data);
      }
    }
  );
};

// Updata data inside a file
lib.update = (dir, file, data, callbackFn) => {
  // Open a file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to string
        const fileData = JSON.stringify(data);

        // Truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            // Write to the file and close it
            fs.writeFile(fileDescriptor, fileData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callbackFn(false);
                  } else {
                    callbackFn("Error in closing a file");
                  }
                });
              } else {
                callbackFn("Error in writing to a file");
              }
            });
          } else {
            callbackFn("Error in truncating the file");
          }
        });
      } else {
        callbackFn("Could not open a file to update, it may not exist");
      }
    }
  );
};

// Delete a file
lib.delete = (dir, file, callbackFn) => {
  // Unlink the file
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callbackFn(false);
    } else {
      callbackFn("Error in deleting a file");
    }
  });
};

// Export the module
export default lib;

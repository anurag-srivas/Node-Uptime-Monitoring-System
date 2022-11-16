/**
 * Utility functions for various tasks
 */

// Dependencies
import crypto from "crypto";
import config from "./config.mjs";

// Container for all the helpers
const helpers = {};

// Create SHA256 helper function
helpers.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHash("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Parse JSON string to JSON object
helpers.parseJsonStringToJsonObject = (str) => {
  try {
    const jsonObject = JSON.parse(str);
    return jsonObject;
  } catch (err) {
    return {};
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (strLength) => {
  strLength =
    typeof strLength === "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go on string
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    let randomString = "";
    for (let i = 1; i <= strLength; i++) {
      // Get the random character from the possible characters
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      randomString += randomCharacter;
    }
    return randomString;
  } else {
    return false;
  }
};

// Export the module
export default helpers;

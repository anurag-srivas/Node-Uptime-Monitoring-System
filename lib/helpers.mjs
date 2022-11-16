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
// Export the module
export default helpers;

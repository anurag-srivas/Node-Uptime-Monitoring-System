/**
 * Create and export configuration variables
 */

// Container for all the environment
const environment = {};

// Staging (default) environment
environment.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
};

// Production environment
environment.production = {
  httpPort: 9998,
  httpsPort: 9999,
  envName: "production",
};

// Determine which environment is passed through command line arguments
const currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Verify that the request environment defined above or not, if not, then default to staging
const environmentToExport =
  typeof environment[currentEnvironment] === "object"
    ? environment[currentEnvironment]
    : environment.staging;

// Export the module
export default environmentToExport;

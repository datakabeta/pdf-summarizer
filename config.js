const dotenv = require("dotenv");
const cfg = {};

if (process.env.NODE_ENV !== "test") {
  dotenv.config({ path: ".env" });
} else {
  dotenv.config({ path: ".env.example", silent: true });
}

// HTTP Port to run our web application
cfg.port = process.env.PORT || 3000;

//environment variables
cfg.apiKey = process.env.COHERE_API_KEY;

// Export configuration object
module.exports = cfg;

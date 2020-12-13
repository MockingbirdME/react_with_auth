const createError = require("http-errors");
const express = require("express");
const path = require("path");
const YAML = require('yamljs');

const router = express.Router();

// Provide very general information about the API.
router.get("/info", (req, res) => {
  res.json({
    message: "Welcome to the API!",
    apiVersion: 1,
    apiBaseUrl: req.originalUrl
  });
});

// Configure SwaggerUI
const apiSpec = YAML.load(path.resolve(__dirname, "spec.yml"));
router.get("/spec", (req, res, next) => {
  // Return the spec.
  if (req.accepts("json")) res.json(apiSpec);
  else if (req.accepts("application/yaml")) res.send(YAML.stringify(apiSpec, 4));
  else
    next(createError(501, "API Spec not yet available in the requested format."));
});

// Use the users.js endpoints for all user or users calls.
router.use('/users?', require('./users'));

// Return a 404 error if the endpoint doesn't exist.
router.use((req, res, next) => next(createError(404, `No API found for method: ${req.method}, at endpoint: ${req.url}`)));

// API error handler
router.use((error, req, res, next) => {
  // Convert the error to an HTTP error then log and return it.
  error = createError(error);
  console.log(error);
  res.status(error.statusCode).json(error);
});

module.exports = router;

"use strict";

const DEFAULT_LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

const ALLOWED_STACKS = new Set(["backend", "frontend"]);
const ALLOWED_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const BACKEND_PACKAGES = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service"
];
const FRONTEND_PACKAGES = ["api", "component", "hook", "page", "state", "style"];
const SHARED_PACKAGES = ["auth", "config", "middleware", "utils"];
const ALLOWED_PACKAGES = new Set([
  ...BACKEND_PACKAGES,
  ...FRONTEND_PACKAGES,
  ...SHARED_PACKAGES
]);

class LogValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "LogValidationError";
  }
}

function parseResponseBody(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    return text;
  }
}

function getAccessToken(options) {
  return (
    options.accessToken ||
    process.env.LOG_ACCESS_TOKEN ||
    process.env.AUTH_TOKEN ||
    process.env.ACCESS_TOKEN ||
    ""
  );
}

function validateLogInput(stack, level, packageName, message) {
  if (!ALLOWED_STACKS.has(stack)) {
    throw new LogValidationError(`Invalid stack "${stack}". Use backend or frontend.`);
  }

  if (!ALLOWED_LEVELS.has(level)) {
    throw new LogValidationError(
      `Invalid level "${level}". Use debug, info, warn, error, or fatal.`
    );
  }

  if (!ALLOWED_PACKAGES.has(packageName)) {
    throw new LogValidationError(`Invalid package "${packageName}".`);
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    throw new LogValidationError("Log message must be a non-empty string.");
  }
}

async function Log(stack, level, packageName, message, options = {}) {
  validateLogInput(stack, level, packageName, message);

  const requestBody = {
    stack,
    level,
    package: packageName,
    message
  };
  const accessToken = getAccessToken(options);
  const logApiUrl = options.logApiUrl || process.env.LOG_API_URL || DEFAULT_LOG_API_URL;

  if (!accessToken) {
    return {
      sent: false,
      skipped: true,
      reason: "LOG_ACCESS_TOKEN is not set",
      requestBody
    };
  }

  try {
    const response = await fetch(logApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });
    const responseText = await response.text();
    const responseBody = parseResponseBody(responseText);

    if (!response.ok) {
      const result = {
        sent: false,
        statusCode: response.status,
        requestBody,
        responseBody
      };

      if (options.throwOnFailure) {
        throw new Error(`Log API failed with status ${response.status}`);
      }

      return result;
    }

    return {
      sent: true,
      statusCode: response.status,
      requestBody,
      responseBody
    };
  } catch (error) {
    if (options.throwOnFailure) {
      throw error;
    }

    return {
      sent: false,
      requestBody,
      error: error.message
    };
  }
}

module.exports = {
  Log,
  LogValidationError,
  allowedValues: {
    stacks: [...ALLOWED_STACKS],
    levels: [...ALLOWED_LEVELS],
    backendPackages: BACKEND_PACKAGES,
    frontendPackages: FRONTEND_PACKAGES,
    sharedPackages: SHARED_PACKAGES
  }
};

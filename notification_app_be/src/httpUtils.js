"use strict";

function sendJson(response, statusCode, data, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    ...headers
  });
  response.end(JSON.stringify(data, null, 2));
}

function sendError(response, statusCode, message, details) {
  const body = { error: message };
  if (details) {
    body.details = details;
  }
  sendJson(response, statusCode, body);
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });

    request.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (_error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    request.on("error", reject);
  });
}

function getPathParts(pathname) {
  return pathname.split("/").filter(Boolean);
}

module.exports = {
  sendJson,
  sendError,
  readJson,
  getPathParts
};

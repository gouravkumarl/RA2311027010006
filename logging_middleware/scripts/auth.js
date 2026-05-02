"use strict";

const AUTH_URL = process.env.AUTH_URL || "http://20.207.122.201/evaluation-service/auth";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

async function main() {
  const requestBody = {
    email: required("EMAIL"),
    name: required("NAME"),
    rollNo: required("ROLL_NO"),
    accessCode: required("ACCESS_CODE"),
    clientID: required("CLIENT_ID"),
    clientSecret: required("CLIENT_SECRET")
  };

  const startedAt = Date.now();
  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  const text = await response.text();

  console.log("Request body:");
  console.log(JSON.stringify(requestBody, null, 2));
  console.log(`Status: ${response.status}`);
  console.log(`Response time: ${Date.now() - startedAt} ms`);
  console.log("Response:");
  console.log(text);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

"use strict";

const REGISTER_URL =
  process.env.REGISTER_URL || "http://20.207.122.201/evaluation-service/register";

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
    mobileNo: required("MOBILE_NO"),
    githubUsername: required("GITHUB_USERNAME"),
    rollNo: required("ROLL_NO"),
    accessCode: required("ACCESS_CODE")
  };

  const startedAt = Date.now();
  const response = await fetch(REGISTER_URL, {
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

"use strict";

const http = require("node:http");
const { URL } = require("node:url");
const { Log } = require("../../logging_middleware/src");
const {
  topPriorityNotifications,
  fetchTopPriorityNotifications
} = require("./notificationService");
const { sendJson, sendError, readJson } = require("./httpUtils");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3002);

async function writeLog(level, packageName, message) {
  const result = await Log("backend", level, packageName, message);
  if (result.error) {
    console.error(`log delivery failed: ${result.error}`);
  }
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(requestUrl.pathname).trim().replace(/\/+$/, "") || "/";
  const startedAt = Date.now();

  try {
    if (request.method === "GET" && pathname === "/health") {
      sendJson(response, 200, {
        status: "ok",
        service: "notification_app_be"
      });
      return;
    }

    if (request.method === "GET" && pathname === "/priority-notifications") {
      const limit = Number(requestUrl.searchParams.get("limit") || 10);
      await writeLog("info", "route", `priority notification request received with limit ${limit}`);
      await writeLog("info", "service", "fetching notifications for priority inbox");
      const result = await fetchTopPriorityNotifications(limit, request.headers.authorization);
      await writeLog("debug", "service", `priority heap returned ${result.count} notifications`);
      await writeLog("info", "service", `selected ${result.count} priority notifications`);
      sendJson(response, 200, result);
      return;
    }

    if (request.method === "POST" && pathname === "/priority-notifications") {
      const body = await readJson(request);
      const limit = Number(body.limit || 10);
      const inputCount = Array.isArray(body.notifications) ? body.notifications.length : 0;
      await writeLog(
        "info",
        "controller",
        `local priority request received with ${inputCount} notifications and limit ${limit}`
      );
      const notifications = topPriorityNotifications(body.notifications || [], limit);
      await writeLog(
        "debug",
        "service",
        `selected ${notifications.length} priority notifications from request body`
      );
      sendJson(response, 200, {
        count: notifications.length,
        notifications
      });
      return;
    }

    await writeLog("warn", "route", `no route matched ${request.method} ${pathname}`);
    sendError(response, 404, "Route not found");
  } catch (error) {
    await writeLog("error", "handler", error.message);
    sendError(response, 400, error.message);
  } finally {
    console.log(`${request.method} ${pathname} ${Date.now() - startedAt}ms`);
  }
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`Notification API running on http://${HOST}:${PORT}`);
  });
}

module.exports = {
  server
};

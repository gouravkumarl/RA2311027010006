"use strict";

const http = require("node:http");
const { URL } = require("node:url");
const { Log } = require("../../logging_middleware/src");
const { buildSchedule, fetchAndBuildSchedule } = require("./maintenanceService");
const { sendJson, sendError, readJson } = require("./httpUtils");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3001);

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
        service: "vehicle_maintenance_scheduler"
      });
      return;
    }

    if (
      request.method === "GET" &&
      (pathname === "/vehicle-scheduling" || pathname === "/schedule")
    ) {
      await writeLog("info", "route", "vehicle scheduling request received");
      await writeLog("info", "service", "fetching depot capacities and vehicle tasks");
      const schedule = await fetchAndBuildSchedule(request.headers.authorization);
      await writeLog(
        "debug",
        "service",
        `received ${schedule.depotCount} depots and ${schedule.taskCount} vehicle tasks`
      );
      await writeLog("info", "service", `created optimized schedules for ${schedule.depotCount} depots`);
      sendJson(response, 200, schedule);
      return;
    }

    if (request.method === "POST" && pathname === "/optimize") {
      const body = await readJson(request);
      const depotCount = Array.isArray(body.depots) ? body.depots.length : 0;
      const taskCount = Array.isArray(body.vehicles) ? body.vehicles.length : 0;
      await writeLog(
        "info",
        "controller",
        `local optimize request received with ${depotCount} depots and ${taskCount} tasks`
      );
      const schedules = buildSchedule(body.depots || [], body.vehicles || []);
      await writeLog("debug", "service", `created ${schedules.length} optimized local schedules`);
      sendJson(response, 200, { schedules });
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
    console.log(`Vehicle Maintenance Scheduler API running on http://${HOST}:${PORT}`);
  });
}

module.exports = {
  server
};

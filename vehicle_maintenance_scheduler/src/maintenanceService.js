"use strict";

const DEFAULT_BASE_URL = "http://20.207.122.201/evaluation-service";

function normalizeToken(token) {
  if (!token) {
    return "";
  }

  return token.replace(/^Bearer\s+/i, "").trim();
}

function getToken(tokenFromRequest) {
  return normalizeToken(tokenFromRequest || process.env.LOG_ACCESS_TOKEN || process.env.ACCESS_TOKEN);
}

async function fetchFromTestServer(path, tokenFromRequest) {
  const token = getToken(tokenFromRequest);
  if (!token) {
    throw new Error("Send Authorization: Bearer <token> or set LOG_ACCESS_TOKEN");
  }

  const response = await fetch(`${process.env.TEST_SERVER_BASE_URL || DEFAULT_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`Protected API failed with status ${response.status}`);
  }

  return body;
}

function normalizeDepot(depot) {
  return {
    id: depot.ID,
    mechanicHours: Number(depot.MechanicHours)
  };
}

function normalizeTask(vehicle) {
  return {
    taskId: vehicle.TaskID,
    duration: Number(vehicle.Duration),
    impact: Number(vehicle.Impact)
  };
}

function chooseBestTasks(tasks, mechanicHours) {
  const capacity = Math.max(0, Math.floor(mechanicHours));
  const dp = Array.from({ length: tasks.length + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= tasks.length; i += 1) {
    const task = tasks[i - 1];

    for (let hours = 0; hours <= capacity; hours += 1) {
      const skip = dp[i - 1][hours];
      const take =
        task.duration <= hours ? task.impact + dp[i - 1][hours - task.duration] : -Infinity;
      dp[i][hours] = Math.max(skip, take);
    }
  }

  const selectedTasks = [];
  let hours = capacity;

  for (let i = tasks.length; i > 0; i -= 1) {
    if (dp[i][hours] !== dp[i - 1][hours]) {
      const task = tasks[i - 1];
      selectedTasks.push(task);
      hours -= task.duration;
    }
  }

  selectedTasks.reverse();

  const totalDuration = selectedTasks.reduce((sum, task) => sum + task.duration, 0);
  const totalImpact = selectedTasks.reduce((sum, task) => sum + task.impact, 0);

  return {
    selectedTasks,
    selectedTaskIds: selectedTasks.map((task) => task.taskId),
    totalDuration,
    totalImpact,
    unusedHours: capacity - totalDuration
  };
}

function buildSchedule(depots, vehicles) {
  const tasks = vehicles.map(normalizeTask);

  return depots.map((depot) => {
    const normalizedDepot = normalizeDepot(depot);
    const result = chooseBestTasks(tasks, normalizedDepot.mechanicHours);

    return {
      depotId: normalizedDepot.id,
      mechanicHours: normalizedDepot.mechanicHours,
      ...result
    };
  });
}

async function fetchAndBuildSchedule(tokenFromRequest) {
  const [depotResponse, vehicleResponse] = await Promise.all([
    fetchFromTestServer("/depots", tokenFromRequest),
    fetchFromTestServer("/vehicles", tokenFromRequest)
  ]);

  const depots = depotResponse.depots || [];
  const vehicles = vehicleResponse.vehicles || [];

  return {
    depotCount: depots.length,
    taskCount: vehicles.length,
    schedules: buildSchedule(depots, vehicles)
  };
}

module.exports = {
  chooseBestTasks,
  buildSchedule,
  fetchAndBuildSchedule
};

# Vehicle Maintenance Scheduler Microservice

This service solves the vehicle maintenance scheduling problem. It fetches depot capacity and vehicle task data from the protected APIs, then chooses the best tasks that fit into each depot's mechanic-hour limit.

I treated this as a 0/1 knapsack problem:

- `Duration` is the weight.
- `Impact` is the value.
- `MechanicHours` is the capacity.

The algorithm is written directly in JavaScript. No external algorithm libraries are used.

## Run

```bash
export LOG_ACCESS_TOKEN="your_access_token"
npm start
```

Default URL: `http://127.0.0.1:3001`

## Endpoints

`GET /vehicle-scheduling`

Fetches `/depots` and `/vehicles` from the protected APIs and returns optimized schedules.

`POST /optimize`

Runs the same algorithm using request body data. I kept this endpoint so the logic can be tested even when the protected API token is not available.

Request:

```json
{
  "depots": [
    { "ID": 1, "MechanicHours": 7 }
  ],
  "vehicles": [
    { "TaskID": "A", "Duration": 3, "Impact": 4 },
    { "TaskID": "B", "Duration": 4, "Impact": 5 },
    { "TaskID": "C", "Duration": 5, "Impact": 6 }
  ]
}
```

Response:

```json
{
  "schedules": [
    {
      "depotId": 1,
      "mechanicHours": 7,
      "selectedTasks": [
        { "taskId": "A", "duration": 3, "impact": 4 },
        { "taskId": "B", "duration": 4, "impact": 5 }
      ],
      "selectedTaskIds": ["A", "B"],
      "totalDuration": 7,
      "totalImpact": 9,
      "unusedHours": 0
    }
  ]
}
```

# Notification Priority Microservice

This service handles the Stage 6 priority inbox part of the campus notifications problem. It fetches notifications from the protected API and returns the most important items first.

The priority score uses two things:

- notification type weight,
- notification timestamp recency.

Current weights:

```js
Placement: 10
Result: 8
Event: 5
```

## Run

```bash
export LOG_ACCESS_TOKEN="your_access_token"
npm start
```

Default URL: `http://127.0.0.1:3002`

## Endpoints

`GET /priority-notifications`

Fetches `/notifications` from the protected API and returns the top 10.

`GET /priority-notifications?limit=5`

Returns the top 5.

`POST /priority-notifications`

Runs the same algorithm using request body data. This is mainly for local testing and screenshots when needed.

Request:

```json
{
  "limit": 2,
  "notifications": [
    {
      "ID": "1",
      "Type": "Event",
      "Message": "farewell",
      "Timestamp": "2026-04-22 17:51:06"
    },
    {
      "ID": "2",
      "Type": "Placement",
      "Message": "hiring update",
      "Timestamp": "2026-04-22 17:49:42"
    },
    {
      "ID": "3",
      "Type": "Result",
      "Message": "mid-sem",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ]
}
```

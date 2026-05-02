# Notification Priority API Outputs

Use `GET /priority-notifications` for the protected API demo after setting `LOG_ACCESS_TOKEN`.

For a quick local check, `POST /priority-notifications` runs the same priority logic with a sample body.

## Local Priority Test

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

Response status: `200`

Response time from local run: `0.025631s`

Response:

```json
{
  "count": 2,
  "notifications": [
    {
      "ID": "2",
      "Type": "Placement",
      "Message": "hiring update",
      "Timestamp": "2026-04-22 17:49:42",
      "PriorityScore": 101776860382
    },
    {
      "ID": "3",
      "Type": "Result",
      "Message": "mid-sem",
      "Timestamp": "2026-04-22 17:51:30",
      "PriorityScore": 81776860490
    }
  ]
}
```

## Protected API Demo

Request:

```text
GET /priority-notifications
```

Response shape:

```json
{
  "count": 10,
  "notifications": [
    {
      "ID": "notification-id",
      "Type": "Placement",
      "Message": "message text",
      "Timestamp": "2026-04-22 17:49:42",
      "PriorityScore": 101776860382
    }
  ]
}
```

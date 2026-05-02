# Notification System Design

## Stage 1

### APIs

`POST /api/notifications`

Headers:

```http
Content-Type: application/json
Authorization: Bearer <token>
```

Request:

```json
{
  "type": "Placement",
  "title": "Placement Drive",
  "message": "Placement company hiring",
  "target": {
    "type": "students",
    "studentIds": [1042, 1043]
  },
  "channels": ["in_app", "email"],
  "priority": 10,
  "sendAt": null
}
```

Response:

```json
{
  "notificationId": "notif_123",
  "status": "queued",
  "createdAt": "2026-04-22T17:51:18Z"
}
```

`GET /api/students/{studentId}/notifications?limit=20&cursor=abc`

```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "Placement",
      "title": "Placement Drive",
      "message": "Placement company hiring",
      "isRead": false,
      "createdAt": "2026-04-22T17:51:18Z"
    }
  ],
  "nextCursor": "next-page-token"
}
```

`PATCH /api/students/{studentId}/notifications/{notificationId}/read`

```json
{
  "notificationId": "notif_123",
  "isRead": true,
  "readAt": "2026-04-22T18:00:00Z"
}
```

### Schemas

Notification:

```json
{
  "id": "string",
  "type": "Placement | Event | Result",
  "title": "string",
  "message": "string",
  "priority": "number",
  "createdAt": "datetime",
  "sendAt": "datetime | null",
  "status": "queued | sent | failed"
}
```

Student notification:

```json
{
  "studentId": "number",
  "notificationId": "string",
  "isRead": "boolean",
  "readAt": "datetime | null",
  "deliveredAt": "datetime | null"
}
```

### Realtime

Use WebSocket or Server-Sent Events. The database remains the source of truth, while realtime delivery is only the fast delivery path. Offline users still receive notifications through the normal fetch API.

## Stage 2

Use PostgreSQL as the primary store. The data has clear relationships, needs reliable writes, and depends on indexed filtering by student, read state, notification type, and time.

### Tables

```sql
CREATE TABLE students (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Placement', 'Event', 'Result')),
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  priority INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  send_at TIMESTAMP NULL
);

CREATE TABLE student_notifications (
  student_id BIGINT NOT NULL REFERENCES students(id),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  delivered_at TIMESTAMP NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, notification_id)
);
```

### Queries

Unread notifications:

```sql
SELECT n.id, n.type, n.title, n.message, sn.created_at
FROM student_notifications sn
JOIN notifications n ON n.id = sn.notification_id
WHERE sn.student_id = $1
  AND sn.is_read = FALSE
ORDER BY sn.created_at DESC
LIMIT 20;
```

Mark read:

```sql
UPDATE student_notifications
SET is_read = TRUE,
    read_at = CURRENT_TIMESTAMP
WHERE student_id = $1
  AND notification_id = $2;
```

NoSQL can be added later as a read model for inboxes, but PostgreSQL should remain the source of truth.

## Stage 3

Given query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

Issues:

- `studentID` and `isRead` should belong to `student_notifications`, not `notifications`.
- `SELECT *` fetches unnecessary columns.
- Without a matching composite index, the database scans and sorts too much data.

Recommended index:

```sql
CREATE INDEX idx_student_unread_created
ON student_notifications (student_id, is_read, created_at DESC);
```

With this index, lookup is close to `O(log n + k)`, where `k` is returned rows. Without it, the query trends toward scan plus sort cost.

Placement notifications from the last 7 days:

```sql
SELECT n.id, n.title, n.message, sn.created_at
FROM student_notifications sn
JOIN notifications n ON n.id = sn.notification_id
WHERE sn.student_id = $1
  AND n.type = 'Placement'
  AND sn.created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
ORDER BY sn.created_at DESC
LIMIT 50;
```

Indexes:

```sql
CREATE INDEX idx_student_recent_notifications
ON student_notifications (student_id, created_at DESC);

CREATE INDEX idx_notification_type
ON notifications (type);
```

## Stage 4

Problem: fetching notifications on every page load overloads the database.

Recommended approach:

- Cache first inbox page and unread count in Redis.
- Use WebSocket/SSE for new notification pushes.
- Use cursor pagination for older notifications.
- Invalidate cache on new notifications and read updates.
- Archive or partition old notification records.

Tradeoffs:

- Cache improves read speed but needs invalidation.
- Realtime reduces polling but needs connection handling.
- Pagination keeps responses small but needs cursor logic.

## Stage 5

Original approach:

```text
for student_id in student_ids:
  send_email(student_id, message)
  save_to_db(student_id, message)
  push_to_app(student_id, message)
```

Problems:

- Synchronous email calls block the whole operation.
- Failure midway leaves inconsistent delivery state.
- Inserts happen one row at a time.
- No retry state or idempotency.
- Email and in-app delivery are tightly coupled.

Better flow:

1. Create notification campaign.
2. Bulk insert recipient rows with `pending` status.
3. Enqueue delivery jobs in batches.
4. Workers process email and in-app delivery.
5. Store each delivery result.
6. Retry temporary failures with backoff.
7. Use idempotency keys to prevent duplicate sends.

Pseudocode:

```text
function notify_all(student_ids, message):
  campaign_id = create_campaign(message)
  bulk_insert_recipients(campaign_id, student_ids, status="pending")

  for batch in chunks(student_ids, 500):
    enqueue("send_notification_batch", campaign_id, batch)

function worker_send_notification_batch(campaign_id, batch):
  for student_id in batch:
    if already_sent(campaign_id, student_id):
      continue

    create_in_app_notification(campaign_id, student_id)
    mark_in_app_sent(campaign_id, student_id)

    try:
      send_email(student_id, campaign_id)
      mark_email_sent(campaign_id, student_id)
    catch temporary_error:
      enqueue_retry(campaign_id, student_id)
    catch permanent_error:
      mark_email_failed(campaign_id, student_id)
```

DB save and email send should not happen as one synchronous operation. Persist first, deliver asynchronously.

## Stage 6

Priority score:

```text
score = typeWeight * 10,000,000,000 + unixTimestampSeconds
```

Weights:

```text
Placement = 10
Result = 8
Event = 5
```

This ranks by importance first and recency second.

For continuous incoming notifications, maintain a min-heap of size 10:

- Add first 10 notifications.
- Compare each new notification with the heap minimum.
- Replace the minimum only if the new score is higher.

Complexity: `O(n log 10)`, effectively linear because heap size is fixed.

Implementation:

```text
notification_app_be/src/notificationService.js
```

Endpoints:

```text
GET /priority-notifications
POST /priority-notifications
```

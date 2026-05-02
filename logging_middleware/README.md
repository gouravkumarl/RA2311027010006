# Logging Middleware

Small reusable Node.js logging package used by both backend services.

```js
const { Log } = require("./logging_middleware/src");

await Log("backend", "error", "handler", "received string, expected bool");
```

## Environment

```bash
export LOG_ACCESS_TOKEN="token-from-auth-api"
```

Optional override:

```bash
export LOG_API_URL="http://20.207.122.201/evaluation-service/logs"
```

## Allowed Values

`stack`: `backend`, `frontend`

`level`: `debug`, `info`, `warn`, `error`, `fatal`

Backend packages:

`cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`

Frontend packages:

`api`, `component`, `hook`, `page`, `state`, `style`

Shared packages:

`auth`, `config`, `middleware`, `utils`

## Test Server Helpers

Registration:

```bash
EMAIL="student@college.edu" \
NAME="Student Name" \
MOBILE_NO="9999999999" \
GITHUB_USERNAME="githubusername" \
ROLL_NO="RA2311027010006" \
ACCESS_CODE="yourAccessCode" \
npm run register
```

Authentication:

```bash
EMAIL="student@college.edu" \
NAME="Student Name" \
ROLL_NO="RA2311027010006" \
ACCESS_CODE="yourAccessCode" \
CLIENT_ID="client-id" \
CLIENT_SECRET="client-secret" \
npm run auth
```

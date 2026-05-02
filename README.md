# Backend Track Submission

- `logging_middleware` - reusable logging package for the protected log API.
- `vehicle_maintenance_scheduler` - vehicle maintenance scheduling microservice.
- `notification_system_design.md` - staged notification system design.
- `notification_app_be` - priority notification microservice.

Both backend services reuse the logging middleware. If you have a fresh token, export it before running the services:

```bash
export LOG_ACCESS_TOKEN="your_bearer_token"
```

If the token is not set, the local app still runs, but protected API calls and remote logging will fail or be skipped.

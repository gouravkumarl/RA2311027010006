# Vehicle Maintenance Scheduler API Outputs

Use `GET /vehicle-scheduling` for the protected API demo after setting `LOG_ACCESS_TOKEN`.

For a quick local check, `POST /optimize` runs the same scheduling logic with a sample body.

## Local Optimize Test

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

Response status: `200`

Response time from local run: `0.028070s`

Response:

```json
{
  "schedules": [
    {
      "depotId": 1,
      "mechanicHours": 7,
      "selectedTasks": [
        {
          "taskId": "A",
          "duration": 3,
          "impact": 4
        },
        {
          "taskId": "B",
          "duration": 4,
          "impact": 5
        }
      ],
      "selectedTaskIds": ["A", "B"],
      "totalDuration": 7,
      "totalImpact": 9,
      "unusedHours": 0
    }
  ]
}
```

## Protected API Demo

Request:

```text
GET /vehicle-scheduling
```

Response status: `200`

Actual response:

```json
{
  "depotCount": 3,
  "taskCount": 34,
  "schedules": [
    {
      "depotId": 1,
      "mechanicHours": 60,
      "selectedTasks": [
        {
          "taskId": "374e8474-cef6-4071-a2c5-9c322a880023",
          "duration": 7,
          "impact": 7
        },
        {
          "taskId": "57855c80-7d3e-43df-b479-d91e7699bc78",
          "duration": 3,
          "impact": 3
        },
        {
          "taskId": "9bd6be1b-ee5f-4ba2-b6da-08f3564b2cd8",
          "duration": 4,
          "impact": 5
        },
        {
          "taskId": "ec4b314d-1e93-4e1c-96de-cc2a6927d73e",
          "duration": 1,
          "impact": 6
        },
        {
          "taskId": "bbe86faa-227f-4cce-b0ff-35f885caa9c4",
          "duration": 4,
          "impact": 5
        },
        {
          "taskId": "77f11a38-7156-44ff-aff8-885dfb4b8eb9",
          "duration": 5,
          "impact": 5
        },
        {
          "taskId": "049818e0-55bf-440b-8019-56bb60ae56b7",
          "duration": 2,
          "impact": 4
        },
        {
          "taskId": "3d1e2193-cffb-4589-9a32-1d5b070c5327",
          "duration": 1,
          "impact": 8
        },
        {
          "taskId": "ea3a3807-d06e-4313-9843-69adfa208b32",
          "duration": 3,
          "impact": 8
        },
        {
          "taskId": "60272101-770d-477f-8940-bdb85fc6c623",
          "duration": 5,
          "impact": 8
        },
        {
          "taskId": "95d39eb1-c8e9-4fb9-b80b-4f8139a34cab",
          "duration": 8,
          "impact": 9
        },
        {
          "taskId": "8d73ec6f-5703-474a-a4bc-bfaba72a605e",
          "duration": 1,
          "impact": 10
        },
        {
          "taskId": "10002d1e-e151-47f4-9c45-771e8029d8f1",
          "duration": 2,
          "impact": 3
        },
        {
          "taskId": "dbf144bd-81e0-4637-96fe-b22ea39da838",
          "duration": 3,
          "impact": 7
        },
        {
          "taskId": "998d568e-9b99-489f-a275-248f960f1ecc",
          "duration": 2,
          "impact": 6
        },
        {
          "taskId": "f4cc196b-3e05-4217-990b-84b73f381730",
          "duration": 3,
          "impact": 4
        },
        {
          "taskId": "398b1710-e0b6-47ca-ba84-86f29112f2fd",
          "duration": 4,
          "impact": 7
        },
        {
          "taskId": "d8d59fbe-924b-4a63-a2ef-26dfc264158e",
          "duration": 2,
          "impact": 9
        }
      ],
      "selectedTaskIds": [
        "374e8474-cef6-4071-a2c5-9c322a880023",
        "57855c80-7d3e-43df-b479-d91e7699bc78",
        "9bd6be1b-ee5f-4ba2-b6da-08f3564b2cd8",
        "ec4b314d-1e93-4e1c-96de-cc2a6927d73e",
        "bbe86faa-227f-4cce-b0ff-35f885caa9c4",
        "77f11a38-7156-44ff-aff8-885dfb4b8eb9",
        "049818e0-55bf-440b-8019-56bb60ae56b7",
        "3d1e2193-cffb-4589-9a32-1d5b070c5327",
        "ea3a3807-d06e-4313-9843-69adfa208b32",
        "60272101-770d-477f-8940-bdb85fc6c623",
        "95d39eb1-c8e9-4fb9-b80b-4f8139a34cab",
        "8d73ec6f-5703-474a-a4bc-bfaba72a605e",
        "10002d1e-e151-47f4-9c45-771e8029d8f1",
        "dbf144bd-81e0-4637-96fe-b22ea39da838",
        "998d568e-9b99-489f-a275-248f960f1ecc",
        "f4cc196b-3e05-4217-990b-84b73f381730",
        "398b1710-e0b6-47ca-ba84-86f29112f2fd",
        "d8d59fbe-924b-4a63-a2ef-26dfc264158e"
      ],
      "totalDuration": 60,
      "totalImpact": 114,
      "unusedHours": 0
    },
    {
      "depotId": 2,
      "mechanicHours": 135,
      "selectedTasks": [
        {
          "taskId": "269a1cfa-5d57-4d9b-b6fc-a4dcece252de",
          "duration": 6,
          "impact": 4
        },
        {
          "taskId": "374e8474-cef6-4071-a2c5-9c322a880023",
          "duration": 7,
          "impact": 7
        },
        {
          "taskId": "500f55e8-ca22-4283-b462-bc0d83567c84",
          "duration": 7,
          "impact": 1
        },
        {
          "taskId": "57855c80-7d3e-43df-b479-d91e7699bc78",
          "duration": 3,
          "impact": 3
        },
        {
          "taskId": "cd91729b-8824-4bce-8222-fa878d5b2fe7",
          "duration": 8,
          "impact": 3
        },
        {
          "taskId": "9bd6be1b-ee5f-4ba2-b6da-08f3564b2cd8",
          "duration": 4,
          "impact": 5
        },
        {
          "taskId": "cf304644-2c43-42a8-9e2c-2643789bb03a",
          "duration": 8,
          "impact": 5
        },
        {
          "taskId": "0ef76c1f-80b3-466c-98f9-e263d58b65d9",
          "duration": 1,
          "impact": 1
        },
        {
          "taskId": "dbff6094-69e6-4d1c-9e33-bad7b29615e0",
          "duration": 5,
          "impact": 4
        },
        {
          "taskId": "ec4b314d-1e93-4e1c-96de-cc2a6927d73e",
          "duration": 1,
          "impact": 6
        },
        {
          "taskId": "bbe86faa-227f-4cce-b0ff-35f885caa9c4",
          "duration": 4,
          "impact": 5
        },
        {
          "taskId": "77f11a38-7156-44ff-aff8-885dfb4b8eb9",
          "duration": 5,
          "impact": 5
        },
        {
          "taskId": "7e77b850-5d72-4063-a0dd-8ee5e8aab048",
          "duration": 4,
          "impact": 2
        },
        {
          "taskId": "df557f07-d2da-44e4-b129-b6fd492b8849",
          "duration": 1,
          "impact": 1
        },
        {
          "taskId": "049818e0-55bf-440b-8019-56bb60ae56b7",
          "duration": 2,
          "impact": 4
        },
        {
          "taskId": "3d1e2193-cffb-4589-9a32-1d5b070c5327",
          "duration": 1,
          "impact": 8
        },
        {
          "taskId": "cc67da38-fb9b-48f0-99bf-4744a5e603bd",
          "duration": 6,
          "impact": 4
        },
        {
          "taskId": "ea3a3807-d06e-4313-9843-69adfa208b32",
          "duration": 3,
          "impact": 8
        },
        {
          "taskId": "60272101-770d-477f-8940-bdb85fc6c623",
          "duration": 5,
          "impact": 8
        },
        {
          "taskId": "95d39eb1-c8e9-4fb9-b80b-4f8139a34cab",
          "duration": 8,
          "impact": 9
        },
        {
          "taskId": "8d73ec6f-5703-474a-a4bc-bfaba72a605e",
          "duration": 1,
          "impact": 10
        },
        {
          "taskId": "10002d1e-e151-47f4-9c45-771e8029d8f1",
          "duration": 2,
          "impact": 3
        },
        {
          "taskId": "738b30a6-b08b-484e-85d6-fcf2c516f786",
          "duration": 4,
          "impact": 1
        },
        {
          "taskId": "dbf144bd-81e0-4637-96fe-b22ea39da838",
          "duration": 3,
          "impact": 7
        },
        {
          "taskId": "c167a38b-6940-4115-8578-8478d53c4417",
          "duration": 7,
          "impact": 7
        },
        {
          "taskId": "998d568e-9b99-489f-a275-248f960f1ecc",
          "duration": 2,
          "impact": 6
        },
        {
          "taskId": "f4cc196b-3e05-4217-990b-84b73f381730",
          "duration": 3,
          "impact": 4
        },
        {
          "taskId": "76727c77-0a7e-4850-9478-2cc84399b485",
          "duration": 5,
          "impact": 1
        },
        {
          "taskId": "398b1710-e0b6-47ca-ba84-86f29112f2fd",
          "duration": 4,
          "impact": 7
        },
        {
          "taskId": "d8d59fbe-924b-4a63-a2ef-26dfc264158e",
          "duration": 2,
          "impact": 9
        },
        {
          "taskId": "744ee202-d629-4125-ad1d-d36c30250c42",
          "duration": 5,
          "impact": 2
        },
        {
          "taskId": "41617eaa-2496-4460-a466-9480e08051ba",
          "duration": 8,
          "impact": 7
        }
      ],
      "selectedTaskIds": [
        "269a1cfa-5d57-4d9b-b6fc-a4dcece252de",
        "374e8474-cef6-4071-a2c5-9c322a880023",
        "500f55e8-ca22-4283-b462-bc0d83567c84",
        "57855c80-7d3e-43df-b479-d91e7699bc78",
        "cd91729b-8824-4bce-8222-fa878d5b2fe7",
        "9bd6be1b-ee5f-4ba2-b6da-08f3564b2cd8",
        "cf304644-2c43-42a8-9e2c-2643789bb03a",
        "0ef76c1f-80b3-466c-98f9-e263d58b65d9",
        "dbff6094-69e6-4d1c-9e33-bad7b29615e0",
        "ec4b314d-1e93-4e1c-96de-cc2a6927d73e",
        "bbe86faa-227f-4cce-b0ff-35f885caa9c4",
        "77f11a38-7156-44ff-aff8-885dfb4b8eb9",
        "7e77b850-5d72-4063-a0dd-8ee5e8aab048",
        "df557f07-d2da-44e4-b129-b6fd492b8849",
        "049818e0-55bf-440b-8019-56bb60ae56b7",
        "3d1e2193-cffb-4589-9a32-1d5b070c5327",
        "cc67da38-fb9b-48f0-99bf-4744a5e603bd",
        "ea3a3807-d06e-4313-9843-69adfa208b32",
        "60272101-770d-477f-8940-bdb85fc6c623",
        "95d39eb1-c8e9-4fb9-b80b-4f8139a34cab",
        "8d73ec6f-5703-474a-a4bc-bfaba72a605e",
        "10002d1e-e151-47f4-9c45-771e8029d8f1",
        "738b30a6-b08b-484e-85d6-fcf2c516f786",
        "dbf144bd-81e0-4637-96fe-b22ea39da838",
        "c167a38b-6940-4115-8578-8478d53c4417",
        "998d568e-9b99-489f-a275-248f960f1ecc",
        "f4cc196b-3e05-4217-990b-84b73f381730",
        "76727c77-0a7e-4850-9478-2cc84399b485",
        "398b1710-e0b6-47ca-ba84-86f29112f2fd",
        "d8d59fbe-924b-4a63-a2ef-26dfc264158e",
        "744ee202-d629-4125-ad1d-d36c30250c42",
        "41617eaa-2496-4460-a466-9480e08051ba"
      ],
      "totalDuration": 135,
      "totalImpact": 157,
      "unusedHours": 0
    },
    {
      "depotId": 3,
      "mechanicHours": 188,
      "selectedTasks": [
        {
          "taskId": "269a1cfa-5d57-4d9b-b6fc-a4dcece252de",
          "duration": 6,
          "impact": 4
        },
        {
          "taskId": "374e8474-cef6-4071-a2c5-9c322a880023",
          "duration": 7,
          "impact": 7
        },
        {
          "taskId": "500f55e8-ca22-4283-b462-bc0d83567c84",
          "duration": 7,
          "impact": 1
        },
        {
          "taskId": "57855c80-7d3e-43df-b479-d91e7699bc78",
          "duration": 3,
          "impact": 3
        },
        {
          "taskId": "cd91729b-8824-4bce-8222-fa878d5b2fe7",
          "duration": 8,
          "impact": 3
        },
        {
          "taskId": "9bd6be1b-ee5f-4ba2-b6da-08f3564b2cd8",
          "duration": 4,
          "impact": 5
        },
        {
          "taskId": "cf304644-2c43-42a8-9e2c-2643789bb03a",
          "duration": 8,
          "impact": 5
        },
        {
          "taskId": "0ef76c1f-80b3-466c-98f9-e263d58b65d9",
          "duration": 1,
          "impact": 1
        },
        {
          "taskId": "dbff6094-69e6-4d1c-9e33-bad7b29615e0",
          "duration": 5,
          "impact": 4
        },
        {
          "taskId": "ec4b314d-1e93-4e1c-96de-cc2a6927d73e",
          "duration": 1,
          "impact": 6
        },
        {
          "taskId": "bbe86faa-227f-4cce-b0ff-35f885caa9c4",
          "duration": 4,
          "impact": 5
        },
        {
          "taskId": "77f11a38-7156-44ff-aff8-885dfb4b8eb9",
          "duration": 5,
          "impact": 5
        },
        {
          "taskId": "7e77b850-5d72-4063-a0dd-8ee5e8aab048",
          "duration": 4,
          "impact": 2
        },
        {
          "taskId": "df557f07-d2da-44e4-b129-b6fd492b8849",
          "duration": 1,
          "impact": 1
        },
        {
          "taskId": "27e7c15b-3009-40fb-a03c-8a840532db0f",
          "duration": 7,
          "impact": 1
        },
        {
          "taskId": "049818e0-55bf-440b-8019-56bb60ae56b7",
          "duration": 2,
          "impact": 4
        },
        {
          "taskId": "3d1e2193-cffb-4589-9a32-1d5b070c5327",
          "duration": 1,
          "impact": 8
        },
        {
          "taskId": "cc67da38-fb9b-48f0-99bf-4744a5e603bd",
          "duration": 6,
          "impact": 4
        },
        {
          "taskId": "ea3a3807-d06e-4313-9843-69adfa208b32",
          "duration": 3,
          "impact": 8
        },
        {
          "taskId": "60272101-770d-477f-8940-bdb85fc6c623",
          "duration": 5,
          "impact": 8
        },
        {
          "taskId": "95d39eb1-c8e9-4fb9-b80b-4f8139a34cab",
          "duration": 8,
          "impact": 9
        },
        {
          "taskId": "8d73ec6f-5703-474a-a4bc-bfaba72a605e",
          "duration": 1,
          "impact": 10
        },
        {
          "taskId": "10002d1e-e151-47f4-9c45-771e8029d8f1",
          "duration": 2,
          "impact": 3
        },
        {
          "taskId": "738b30a6-b08b-484e-85d6-fcf2c516f786",
          "duration": 4,
          "impact": 1
        },
        {
          "taskId": "dbf144bd-81e0-4637-96fe-b22ea39da838",
          "duration": 3,
          "impact": 7
        },
        {
          "taskId": "c167a38b-6940-4115-8578-8478d53c4417",
          "duration": 7,
          "impact": 7
        },
        {
          "taskId": "998d568e-9b99-489f-a275-248f960f1ecc",
          "duration": 2,
          "impact": 6
        },
        {
          "taskId": "f4cc196b-3e05-4217-990b-84b73f381730",
          "duration": 3,
          "impact": 4
        },
        {
          "taskId": "76727c77-0a7e-4850-9478-2cc84399b485",
          "duration": 5,
          "impact": 1
        },
        {
          "taskId": "398b1710-e0b6-47ca-ba84-86f29112f2fd",
          "duration": 4,
          "impact": 7
        },
        {
          "taskId": "d8d59fbe-924b-4a63-a2ef-26dfc264158e",
          "duration": 2,
          "impact": 9
        },
        {
          "taskId": "d068b3ff-a046-465d-a58a-90defce95888",
          "duration": 3,
          "impact": 1
        },
        {
          "taskId": "744ee202-d629-4125-ad1d-d36c30250c42",
          "duration": 5,
          "impact": 2
        },
        {
          "taskId": "41617eaa-2496-4460-a466-9480e08051ba",
          "duration": 8,
          "impact": 7
        }
      ],
      "selectedTaskIds": [
        "269a1cfa-5d57-4d9b-b6fc-a4dcece252de",
        "374e8474-cef6-4071-a2c5-9c322a880023",
        "500f55e8-ca22-4283-b462-bc0d83567c84",
        "57855c80-7d3e-43df-b479-d91e7699bc78",
        "cd91729b-8824-4bce-8222-fa878d5b2fe7",
        "9bd6be1b-ee5f-4ba2-b6da-08f3564b2cd8",
        "cf304644-2c43-42a8-9e2c-2643789bb03a",
        "0ef76c1f-80b3-466c-98f9-e263d58b65d9",
        "dbff6094-69e6-4d1c-9e33-bad7b29615e0",
        "ec4b314d-1e93-4e1c-96de-cc2a6927d73e",
        "bbe86faa-227f-4cce-b0ff-35f885caa9c4",
        "77f11a38-7156-44ff-aff8-885dfb4b8eb9",
        "7e77b850-5d72-4063-a0dd-8ee5e8aab048",
        "df557f07-d2da-44e4-b129-b6fd492b8849",
        "27e7c15b-3009-40fb-a03c-8a840532db0f",
        "049818e0-55bf-440b-8019-56bb60ae56b7",
        "3d1e2193-cffb-4589-9a32-1d5b070c5327",
        "cc67da38-fb9b-48f0-99bf-4744a5e603bd",
        "ea3a3807-d06e-4313-9843-69adfa208b32",
        "60272101-770d-477f-8940-bdb85fc6c623",
        "95d39eb1-c8e9-4fb9-b80b-4f8139a34cab",
        "8d73ec6f-5703-474a-a4bc-bfaba72a605e",
        "10002d1e-e151-47f4-9c45-771e8029d8f1",
        "738b30a6-b08b-484e-85d6-fcf2c516f786",
        "dbf144bd-81e0-4637-96fe-b22ea39da838",
        "c167a38b-6940-4115-8578-8478d53c4417",
        "998d568e-9b99-489f-a275-248f960f1ecc",
        "f4cc196b-3e05-4217-990b-84b73f381730",
        "76727c77-0a7e-4850-9478-2cc84399b485",
        "398b1710-e0b6-47ca-ba84-86f29112f2fd",
        "d8d59fbe-924b-4a63-a2ef-26dfc264158e",
        "d068b3ff-a046-465d-a58a-90defce95888",
        "744ee202-d629-4125-ad1d-d36c30250c42",
        "41617eaa-2496-4460-a466-9480e08051ba"
      ],
      "totalDuration": 145,
      "totalImpact": 159,
      "unusedHours": 43
    }
  ]
}
```

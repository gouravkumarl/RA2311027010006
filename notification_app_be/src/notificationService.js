"use strict";

const DEFAULT_BASE_URL = "http://20.207.122.201/evaluation-service";

const TYPE_WEIGHTS = {
  Placement: 10,
  Result: 8,
  Event: 5
};

function normalizeToken(token) {
  if (!token) {
    return "";
  }

  return token.replace(/^Bearer\s+/i, "").trim();
}

function getToken(tokenFromRequest) {
  return normalizeToken(tokenFromRequest || process.env.LOG_ACCESS_TOKEN || process.env.ACCESS_TOKEN);
}

async function fetchNotifications(tokenFromRequest) {
  const token = getToken(tokenFromRequest);
  if (!token) {
    throw new Error("Send Authorization: Bearer <token> or set LOG_ACCESS_TOKEN");
  }

  const response = await fetch(
    `${process.env.TEST_SERVER_BASE_URL || DEFAULT_BASE_URL}/notifications`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`Protected API failed with status ${response.status}`);
  }

  return body.notifications || [];
}

function timestampValue(notification) {
  const value = new Date(notification.Timestamp).getTime();
  return Number.isNaN(value) ? 0 : value;
}

function priorityScore(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 1;
  const recencyPoints = Math.floor(timestampValue(notification) / 1000);

  return typeWeight * 10_000_000_000 + recencyPoints;
}

function isHigherPriority(left, right) {
  if (left.PriorityScore !== right.PriorityScore) {
    return left.PriorityScore > right.PriorityScore;
  }
  return timestampValue(left) > timestampValue(right);
}

function isLowerPriority(left, right) {
  if (left.PriorityScore !== right.PriorityScore) {
    return left.PriorityScore < right.PriorityScore;
  }
  return timestampValue(left) < timestampValue(right);
}

function swap(items, leftIndex, rightIndex) {
  const temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}

function bubbleUp(heap, index) {
  let current = index;

  while (current > 0) {
    const parent = Math.floor((current - 1) / 2);
    if (!isLowerPriority(heap[current], heap[parent])) {
      break;
    }
    swap(heap, current, parent);
    current = parent;
  }
}

function bubbleDown(heap, index) {
  let current = index;

  while (true) {
    const left = current * 2 + 1;
    const right = current * 2 + 2;
    let smallest = current;

    if (left < heap.length && isLowerPriority(heap[left], heap[smallest])) {
      smallest = left;
    }

    if (right < heap.length && isLowerPriority(heap[right], heap[smallest])) {
      smallest = right;
    }

    if (smallest === current) {
      break;
    }

    swap(heap, current, smallest);
    current = smallest;
  }
}

function topPriorityNotifications(notifications, limit = 10) {
  const maxItems = Math.max(1, Math.floor(limit));
  const heap = [];

  for (const notification of notifications) {
    const item = {
      ...notification,
      PriorityScore: priorityScore(notification)
    };

    if (heap.length < maxItems) {
      heap.push(item);
      bubbleUp(heap, heap.length - 1);
    } else if (isHigherPriority(item, heap[0])) {
      heap[0] = item;
      bubbleDown(heap, 0);
    }
  }

  return heap.sort((left, right) => {
    if (isHigherPriority(left, right)) {
      return -1;
    }
    if (isHigherPriority(right, left)) {
      return 1;
    }
    return 0;
  });
}

async function fetchTopPriorityNotifications(limit = 10, tokenFromRequest) {
  const notifications = await fetchNotifications(tokenFromRequest);

  return {
    count: Math.min(limit, notifications.length),
    notifications: topPriorityNotifications(notifications, limit)
  };
}

module.exports = {
  TYPE_WEIGHTS,
  priorityScore,
  topPriorityNotifications,
  fetchTopPriorityNotifications
};

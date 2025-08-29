import client, { Counter, Histogram } from "prom-client";

// Registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Counter: counts requests
export const requestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of requests",
  labelNames: ["method", "route", "code"],
});

// Histogram: measures request duration
export const requestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Request duration in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.5, 1, 2, 5], // buckets in seconds
});

register.registerMetric(requestCounter);
register.registerMetric(requestDuration);

export const getMetrics = async () => {
  return await register.metrics();
};

import net from "node:net";
import path from "node:path";
import {
  checksDirectory,
  readJson,
  servicesConfigPath,
  writeJson,
} from "./fs.mjs";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const CHECK_RETENTION_DAYS = 120;
const HTTP_STATUS_OK_MIN = 200;
const HTTP_STATUS_OK_MAX = 399;

export async function loadServicesConfig() {
  return readJson(servicesConfigPath, { site: {}, services: [] });
}

export function getCheckHistoryPath(slug) {
  return path.join(checksDirectory, `${slug}.json`);
}

export async function readServiceChecks(slug) {
  return readJson(getCheckHistoryPath(slug), []);
}

export async function writeServiceChecks(slug, checks) {
  return writeJson(getCheckHistoryPath(slug), checks);
}

export async function runServiceCheck(service) {
  if (service.kind === "tcp") {
    return performTcpCheck(service);
  }

  return performHttpCheck(service);
}

async function performHttpCheck(service) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), service.timeoutMs ?? 8000);

  try {
    const response = await fetch(service.url, {
      method: service.method ?? "GET",
      redirect: "follow",
      signal: controller.signal,
    });

    const responseTime = Date.now() - startedAt;
    const ok =
      response.status >= HTTP_STATUS_OK_MIN &&
      response.status <= HTTP_STATUS_OK_MAX;

    return {
      timestamp: new Date().toISOString(),
      status: ok ? "operational" : "outage",
      responseTime,
      code: response.status,
      error: ok ? null : `Unexpected status code ${response.status}`,
    };
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      status: "outage",
      responseTime: null,
      code: null,
      error: error instanceof Error ? error.message : "Request failed",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function performTcpCheck(service) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const startedAt = Date.now();

    const finish = (payload) => {
      socket.destroy();
      resolve({
        timestamp: new Date().toISOString(),
        code: null,
        ...payload,
      });
    };

    socket.setTimeout(service.timeoutMs ?? 5000);
    socket.once("connect", () => {
      finish({
        status: "operational",
        responseTime: Date.now() - startedAt,
        error: null,
      });
    });
    socket.once("timeout", () => {
      finish({
        status: "outage",
        responseTime: null,
        error: "Connection timed out",
      });
    });
    socket.once("error", (error) => {
      finish({
        status: "outage",
        responseTime: null,
        error: error.message,
      });
    });

    socket.connect(service.port, service.host);
  });
}

export function pruneChecks(checks) {
  const cutoff = Date.now() - CHECK_RETENTION_DAYS * DAY_IN_MS;

  return checks.filter((check) => Date.parse(check.timestamp) >= cutoff);
}

export function createWindow(days) {
  const now = new Date();
  const end = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23,
    59,
    59,
    999,
  );

  return Array.from({ length: days }, (_, index) => {
    const time = end - (days - 1 - index) * DAY_IN_MS;
    return new Date(time);
  });
}

export function aggregateDailyBars(checks, days = 90) {
  const daysWindow = createWindow(days);

  return daysWindow.map((day) => {
    const dayStart = Date.UTC(
      day.getUTCFullYear(),
      day.getUTCMonth(),
      day.getUTCDate(),
      0,
      0,
      0,
      0,
    );
    const dayEnd = dayStart + DAY_IN_MS;

    const dayChecks = checks.filter((check) => {
      const timestamp = Date.parse(check.timestamp);
      return timestamp >= dayStart && timestamp < dayEnd;
    });

    if (dayChecks.length === 0) {
      return {
        date: new Date(dayStart).toISOString(),
        label: "Collecting data",
        status: "unknown",
        availability: null,
        averageResponseTime: null,
      };
    }

    const successfulChecks = dayChecks.filter(
      (check) => check.status === "operational",
    );
    const availability = successfulChecks.length / dayChecks.length;

    let status = "operational";
    if (availability < 0.97) {
      status = "outage";
    } else if (availability < 0.999) {
      status = "degraded";
    }

    const responseTimes = successfulChecks
      .map((check) => check.responseTime)
      .filter((value) => typeof value === "number");

    const averageResponseTime =
      responseTimes.length > 0
        ? Math.round(
            responseTimes.reduce((sum, value) => sum + value, 0) /
              responseTimes.length,
          )
        : null;

    return {
      date: new Date(dayStart).toISOString(),
      label: `${Math.round(availability * 10000) / 100}% uptime`,
      status,
      availability,
      averageResponseTime,
    };
  });
}

export function calculateUptime(checks, hours = null) {
  const filteredChecks =
    hours === null
      ? checks
      : checks.filter(
          (check) =>
            Date.parse(check.timestamp) >= Date.now() - hours * 60 * 60 * 1000,
        );

  if (filteredChecks.length === 0) {
    return null;
  }

  const successfulChecks = filteredChecks.filter(
    (check) => check.status === "operational",
  );

  return successfulChecks.length / filteredChecks.length;
}

export function averageResponseTime(checks, hours = 24) {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  const responseTimes = checks
    .filter((check) => Date.parse(check.timestamp) >= cutoff)
    .map((check) => check.responseTime)
    .filter((value) => typeof value === "number");

  if (responseTimes.length === 0) {
    return null;
  }

  return Math.round(
    responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length,
  );
}

export function buildSparkline(checks, points = 48) {
  return checks
    .slice(-points)
    .map((check) =>
      typeof check.responseTime === "number" ? check.responseTime : null,
    );
}

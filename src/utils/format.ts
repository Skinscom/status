export function formatPercent(value: number | null, digits = 2) {
  if (value === null) {
    return "Collecting";
  }

  return `${(value * 100).toFixed(digits)}%`;
}

export function formatResponseTime(value: number | null) {
  if (value === null) {
    return "N/A";
  }

  return `${value} ms`;
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "Waiting for first check";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatRelativeTime(value: string | null) {
  if (!value) {
    return "Waiting for first check";
  }

  const diff = Date.now() - Date.parse(value);
  const minutes = Math.max(1, Math.round(diff / 60_000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 48) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function sentenceCase(value: string) {
  if (!value) {
    return value;
  }

  return value[0].toUpperCase() + value.slice(1);
}

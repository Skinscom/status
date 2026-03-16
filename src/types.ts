export type ServiceStatus = "operational" | "degraded" | "outage" | "unknown";

export interface SiteConfig {
  name: string;
  baseUrl: string;
  websiteUrl: string;
  repositoryUrl: string;
  subscribeUrl: string;
  description: string;
  pollIntervalMinutes: number;
}

export interface OverallStatus {
  status: ServiceStatus;
  title: string;
  message: string;
}

export interface DailyBar {
  date: string;
  label: string;
  status: ServiceStatus;
  availability: number | null;
  averageResponseTime: number | null;
}

export interface ServiceStatusData {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  target: string;
  kind: string;
  currentStatus: ServiceStatus;
  lastCheckedAt: string | null;
  responseTime: number | null;
  httpCode: number | null;
  latestError: string | null;
  uptime90d: number | null;
  uptime24h: number | null;
  averageResponseTime24h: number | null;
  sparkline: Array<number | null>;
  dailyBars: DailyBar[];
}

export interface IncidentUpdate {
  id: string;
  label: string;
  body: string;
  createdAt: string;
}

export interface Incident {
  id: number;
  kind: "incident" | "maintenance";
  impact: string;
  title: string;
  summary: string;
  status: string;
  startedAt: string;
  resolvedAt: string | null;
  updatedAt: string;
  url: string;
  affectedServices: string[];
  updates: IncidentUpdate[];
}

export interface StatusSiteData {
  site: SiteConfig;
  generatedAt: string;
  overall: OverallStatus;
  metrics: {
    monitoredServices: number;
    operationalServices: number;
    averageResponseTime24h: number | null;
    uptime90d: number | null;
  };
  services: ServiceStatusData[];
  incidents: Incident[];
}

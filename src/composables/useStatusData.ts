import { onMounted, onUnmounted, ref } from "vue";
import type { StatusSiteData } from "@/types";

const statusData = ref<StatusSiteData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

let activePromise: Promise<void> | null = null;
let intervalId: number | null = null;

async function fetchStatusData() {
  if (activePromise) {
    return activePromise;
  }

  loading.value = true;
  error.value = null;

  activePromise = (async () => {
    try {
      const response = await fetch(`/data/status-data.json?ts=${Date.now()}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to load status data (${response.status})`);
      }

      statusData.value = (await response.json()) as StatusSiteData;
    } catch (fetchError) {
      error.value =
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load status data.";
    } finally {
      loading.value = false;
      activePromise = null;
    }
  })();

  return activePromise;
}

export function useStatusData() {
  onMounted(() => {
    void fetchStatusData();

    if (intervalId === null) {
      intervalId = window.setInterval(() => {
        void fetchStatusData();
      }, 60_000);
    }
  });

  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  return {
    statusData,
    loading,
    error,
    refresh: fetchStatusData,
  };
}

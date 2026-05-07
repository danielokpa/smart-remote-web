import { getStationLoginType } from "@/lib/api/api-client";
import type { StationType } from "@/lib/types/station.type";
import { STATION_UI_CONFIG } from "@/lib/config/dashboard/station-ui.config";

export function useStationUI() {
  const stationType: StationType = getStationLoginType() as StationType;

  const config = STATION_UI_CONFIG[stationType];
  return config;
}
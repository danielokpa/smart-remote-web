import { getStationApi } from "@/lib/api/stations/station-api.resolver";

export const useStationApi = () => {
  return getStationApi();
};
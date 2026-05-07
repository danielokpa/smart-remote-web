import { getStationLoginType } from "../api-client";
import { LoginType } from "@/enums/login-type.enum";

import { cngConversionApi } from "./cng-conversion/api";
import { cngFuelingApi } from "./cng-fueling/api";
import { evChargingApi } from "./ev-charging/api";

export const getStationApi = () => {
  const type = getStationLoginType();

  switch (type) {
    case LoginType.CNG_CONVERSION_STATION:
      return cngConversionApi;

    case LoginType.CNG_STATION:
      return cngFuelingApi;

    case LoginType.EV_CHARGING_STATION:
      return evChargingApi;

    default:
      throw new Error("Invalid or missing station type");
  }
};
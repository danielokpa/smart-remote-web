import { } from "@/lib/api/api-client";
import { apiRequest } from "@/lib/api/api-client";
import { LoginType } from "@/enums/login-type.enum";

/**
 * Auth API endpoints
 */
export const authApi = {
  login: (identity: string, userType: LoginType) =>
    apiRequest<{ email: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identity, userType }),
    }),

  loginWithOtp: (identity: string, otp: string, deviceInfo: string, userType: LoginType) =>
    apiRequest<{ token: string; user: any }>("/auth/login-with-otp", {
      method: "POST",
      body: JSON.stringify({ identity, otp, deviceInfo, userType }),
    }),
};

// /**
//  * CNG Station API endpoints
//  */
// export const cngStationApi = {
//   getConversions: (page: number = 1, limit: number = 10) => {
//     const params = new URLSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//     });
//     return apiRequest<{
//       data: any[];
//       total: number;
//       currentPage: number;
//       totalPages: number;
//     }>(`/cng-station/cng-conversions?${params}`);
//   },

//   getConversionById: (id: string) =>
//     apiRequest(`/cng-station/conversion/${id}`, { method: "GET" }),
// };

// export const stationSettingsApi = {
//   requestUpdate: () => {
//     const stationType = getStationLoginType();

//     switch(stationType) {
//       case LoginType.CNG_STATION:
//         return apiRequest('/cng-fueling-stations/update', {
//           method: "POST",
//         });
        
//       case LoginType.CNG_CONVERSION_STATION:
//         return apiRequest('/cng-station/update', {
//           method: "POST",
//         });
        
//       case LoginType.EV_CHARGING_STATION:
//         return apiRequest('/charging-station/update', {
//           method: "POST",
//         });

//       default:
//         return Promise.resolve({
//           success: false,
//           message: "Missing station login type. Please login again",
//           statusCode: 400,
//         })
//     }
//   },

//   updateWithOtp: (otp: string, updateData: any) => {
//     const stationType = getStationLoginType();
//     switch (stationType) {
//       case LoginType.CNG_STATION:
//         return apiRequest("/cng-fueling-station", {
//           method: "PATCH",
//           body: JSON.stringify({ otp, updateData }),
//         });
//       case LoginType.CNG_CONVERSION_STATION:
//         return apiRequest("/cng-station", {
//           method: "PATCH",
//           body: JSON.stringify({ otp, updateData }),
//         });

//       case LoginType.EV_CHARGING_STATION:
//         return apiRequest("/charging-station", {
//           method: "PATCH",
//           body: JSON.stringify({ otp, updateData }),
//         });

//       default:
//         return Promise.resolve<ApiResponse<any>>({
//           success: false,
//           message: "Missing station login type. Please login again.",
//           statusCode: 400,
//           data: undefined,
//         });
//     }
//   },
// }

// export const stationProfileApi = {
//   getProfile: () => {
//     const stationType = getStationLoginType();

//     // ✅ pick endpoint based on station type
//     switch (stationType) {
//       case LoginType.CNG_STATION:
//         return apiRequest("/cng-fueling-stations", { method: "GET" });

//       case LoginType.CNG_CONVERSION_STATION:
//         return apiRequest("/cng-station", { method: "GET" });

//       case LoginType.EV_CHARGING_STATION:
//         return apiRequest("/charging-station", { method: "GET" });

//       default:
//         return Promise.resolve<ApiResponse<any>>({
//           success: false,
//           message: "Missing station login type. Please login again.",
//           statusCode: 400,
//           data: undefined,
//         });
//     }
//   },
// };

// export const stationPayoutApi = {
//   fetchPayouts: () => {
//     const stationType = getStationLoginType();

//     switch (stationType) {
//       case LoginType.CNG_STATION:
//         return apiRequest("/cng-fueling-stations/payouts", { method: "GET" });
        
//       case LoginType.CNG_CONVERSION_STATION:
//         return apiRequest("/cng-station/payouts", { method: "GET" });

//       case LoginType.EV_CHARGING_STATION:
//         return apiRequest("/charging-station/payouts", { method: "GET" });

//       default:
//         return Promise.resolve<ApiResponse<any>>({
//           success: false,
//           message: "Missing station login type. Please login again.",
//           statusCode: 400,
//           data: undefined,
//         });
//     }
//   },

//   fetchBalance: () => {
//     const stationType = getStationLoginType();

//     switch (stationType) {
//       case LoginType.CNG_STATION:
//         return apiRequest("/cng-fueling-stations/payouts/balance", { method: "GET" });
        
//       case LoginType.CNG_CONVERSION_STATION:
//         return apiRequest("/cng-station/payouts/balance", { method: "GET" });

//       case LoginType.EV_CHARGING_STATION:
//         return apiRequest("/charging-station/payouts/balance", { method: "GET" });

//       default:
//         return Promise.resolve<ApiResponse<any>>({
//           success: false,
//           message: "Missing station login type. Please login again.",
//           statusCode: 400,
//           data: undefined,
//         });
//     }
//   },

//   requestPayout: (amount: number) => {
//     const stationType = getStationLoginType();

//     switch (stationType) {
//       case LoginType.CNG_STATION:
//         return apiRequest("/cng-fueling-stations/payouts", {
//           method: "POST",
//           body: JSON.stringify({ amount: Number(amount) }),
//         });
        
//       case LoginType.CNG_CONVERSION_STATION:
//         return apiRequest("/cng-station/payouts", {
//           method: "POST",
//           body: JSON.stringify({ amount: Number(amount) }),
//         });

//       case LoginType.EV_CHARGING_STATION:
//         return apiRequest("/charging-station/payouts", {
//           method: "POST",
//           body: JSON.stringify({ amount: Number(amount) }),
//         });

//       default:
//         return Promise.resolve<ApiResponse<any>>({
//           success: false,
//           message: "Missing station login type. Please login again.",
//           statusCode: 400,
//           data: undefined,
//         });
//     }
//   }
// }
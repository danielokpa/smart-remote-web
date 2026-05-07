import { apiRequest } from "../../api-client";

export const cngConversionApi = {
  // dashboard
  fetchDashboard: (filter: { cursor?: string | null, limit: number }) => {
    const params = new URLSearchParams();
    if (filter.cursor)
      params.append("cursor", filter.cursor);

    params.append("limit", String(filter?.limit ?? 10));

    return apiRequest(`/cng-station/cng-conversions?${params}`);
  },

  // conversion
  getActivityById: (id: string) =>
    apiRequest(`/cng-station/conversion/${id}`, { method: "GET" }),

  // profile
  getProfile: () =>
    apiRequest("/cng-station", { method: "GET" }),

  // settings
  requestUpdate: () =>
    apiRequest("/cng-station/update", { method: "POST" }),

  updateWithOtp: (otp: string, updateData: any) =>
    apiRequest("/cng-station", {
      method: "PATCH",
      body: JSON.stringify({ otp, updateData }),
    }),

  // tokens
  fetchTokenSales: () =>
    apiRequest("/cng-station/tokens", { method: "GET" }),

  // payouts
  fetchPayouts: () =>
    apiRequest("/cng-station/payouts", { method: "GET" }),

  fetchBalance: () =>
    apiRequest("/cng-station/payouts/balance", { method: "GET" }),

  requestPayout: (amount: number) =>
    apiRequest("/cng-station/payouts", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};
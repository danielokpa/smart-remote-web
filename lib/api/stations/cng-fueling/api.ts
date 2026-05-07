import { apiRequest } from "../../api-client";

export const cngFuelingApi = {
  fetchDashboard: (filter: { cursor?: string | null, limit: number }) => {
    const params = new URLSearchParams();
    if (filter.cursor) {
      params.append("cursor", filter.cursor);
    }

    params.append("limit", String(filter?.limit ?? 10));

    return apiRequest(`/cng-fueling-stations/fueling-sessions?${params}`);
  },

  // fueling
  getActivityById: (id: string) =>
    apiRequest(`/cng-fueling-stations/fueling-sessions/${id}`, { method: "GET" }),

  getProfile: () =>
    apiRequest("/cng-fueling-stations", { method: "GET" }),

  requestUpdate: () =>
    apiRequest("/cng-fueling-stations/update", { method: "POST" }),

  updateWithOtp: (otp: string, updateData: any) =>
    apiRequest("/cng-fueling-stations", {
      method: "PATCH",
      body: JSON.stringify({ otp, updateData }),
    }),
  // tokens
  fetchTokenSales: () =>
    apiRequest("/cng-fueling-stations/tokens", { method: "GET" }),

  fetchPayouts: () =>
    apiRequest("/cng-fueling-stations/payouts", { method: "GET" }),

  fetchBalance: () =>
    apiRequest("/cng-fueling-stations/payouts/balance", { method: "GET" }),

  requestPayout: (amount: number) =>
    apiRequest("/cng-fueling-stations/payouts", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};
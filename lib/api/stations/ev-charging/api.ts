import { apiRequest } from "../../api-client";

export const evChargingApi = {
  fetchDashboard: (filter: { cursor?: string | null, limit: number }) => {
    const params = new URLSearchParams();
    if (filter.cursor) {
      params.append("cursor", filter.cursor);
    }

    params.append("limit", String(filter?.limit ?? 10));

    return apiRequest(`/charging-station/charging-sessions?${params}`);
  },

  // charging
  getActivityById: (id: string) =>
    apiRequest(`/charging-station/charging-sessions/${id}`, { method: "GET" }),

  getProfile: () =>
    apiRequest("/charging-station", { method: "GET" }),

  requestUpdate: () =>
    apiRequest("/charging-station/update", { method: "POST" }),

  updateWithOtp: (otp: string, updateData: any) =>
    apiRequest("/charging-station", {
      method: "PATCH",
      body: JSON.stringify({ otp, updateData }),
    }),

  // tokens
  fetchTokenSales: () =>
    apiRequest("/charging-station/tokens", { method: "GET" }),

  fetchPayouts: () =>
    apiRequest("/charging-station/payouts", { method: "GET" }),

  fetchBalance: () =>
    apiRequest("/charging-station/payouts/balance", { method: "GET" }),

  requestPayout: (amount: number) =>
    apiRequest("/charging-station/payouts", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};
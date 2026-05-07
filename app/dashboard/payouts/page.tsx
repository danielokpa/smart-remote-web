"use client";

import { useEffect, useState } from "react";
import { useStationApi } from "@/lib/hooks/stations/useStationApi";
import clsx from "clsx";

type Payout = {
  id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

export default function PayoutPage() {
  const [balance, setBalance] = useState<number>(0);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useStationApi();

  /* ---------------- FETCH DATA ---------------- */

  const loadData = async () => {
    const [balanceRes, payoutsRes] = await Promise.all([
        api.fetchBalance(),
        api.fetchPayouts(),
    ]);

    if (balanceRes.success) {
        setBalance(balanceRes.data?.balance || 0);
    }

    if (payoutsRes.success) {
        setPayouts(payoutsRes.data || []);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
        setFetching(true);
        setError(null);

        const [balanceRes, payoutsRes] = await Promise.all([
          api.fetchBalance(),
          api.fetchPayouts(),
        ]);

        if (!mounted) return;

        if (balanceRes.success) {
        setBalance(balanceRes.data?.balance || 0);
        } else {
        setError(balanceRes.message);
        }

        if (payoutsRes.success) {
        setPayouts(payoutsRes.data || []);
        } else {
        setError(payoutsRes.message);
        }

        setFetching(false);
    };

    init();

    return () => {
        mounted = false; // prevents state update after unmount
    };
    }, []);

  /* ---------------- REQUEST PAYOUT ---------------- */

  const handleRequest = async () => {
    if (!amount) return;

    setLoading(true);
    setError(null);

    const res = await api.requestPayout(Number(amount));

    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setAmount("");
    await loadData(); // refresh data
    setLoading(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Payouts</h1>
        <p className="text-[#8E94A4] text-sm">
          Manage your earnings and request withdrawals
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-[#1b0f2a] border border-white/10 rounded-2xl p-5">
        <p className="text-[#8E94A4] text-sm">Available Balance</p>

        {fetching ? (
          <p className="text-white text-xl mt-2">Loading...</p>
        ) : (
          <h2 className="text-white text-3xl font-bold mt-1">
            ₦{balance.toLocaleString()}
          </h2>
        )}
      </div>

      {/* Request Payout */}
      <div className="bg-[#1b0f2a] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-semibold">Request Payout</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            min="0"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-[#11021f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
          />

          <button
            onClick={handleRequest}
            disabled={loading}
            className={clsx(
              "w-full sm:w-auto px-5 py-3 rounded-xl font-semibold min-h-[48px] hover:cursor-pointer",
              loading
                ? "bg-purple-400/40"
                : "bg-purple-600 hover:bg-purple-700"
            )}
          >
            {loading ? "Processing..." : "Request"}
          </button>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-[#1b0f2a] border border-white/10 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">Payout History</h3>

        {fetching ? (
          <p className="text-[#8E94A4]">Loading payouts...</p>
        ) : payouts.length === 0 ? (
          <p className="text-[#8E94A4]">No payout history yet</p>
        ) : (
          <div className="space-y-3">
            {payouts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-white/5 pb-3"
                >
                <div>
                    <p className="text-white font-medium">
                    ₦{Number(p.amount).toLocaleString()}
                    </p>
                    <p className="text-[#8E94A4] text-xs">
                    {new Date(p.createdAt).toLocaleString()}
                    </p>
                </div>

                <span
                    className={clsx(
                    "text-xs px-3 py-1 rounded-full w-fit",
                    p.status === "APPROVED" && "bg-green-500/20 text-green-400",
                    p.status === "PENDING" && "bg-yellow-500/20 text-yellow-400",
                    p.status === "REJECTED" && "bg-red-500/20 text-red-400"
                    )}
                >
                    {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
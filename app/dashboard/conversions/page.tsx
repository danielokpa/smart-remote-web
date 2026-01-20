"use client";

import { useState, useEffect } from "react";
import { cngStationApi } from "@/lib/api";

interface Conversion {
  id: string;
  status: string;
  vehicleInfo?: any;
  createdAt?: string;
  [key: string]: any;
}

export default function ConversionsPage() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const fetchConversions = async (page: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await cngStationApi.getConversions(page, limit);

      if (response.success && response.data) {
        setConversions(response.data.data || []);
        setCurrentPage(response.data.currentPage || page);
        setTotalPages(response.data.totalPages || 1);
        setTotal(response.data.total || 0);
      } else {
        setError(response.message || "Failed to load conversions");
      }
    } catch (err) {
      setError("An error occurred while loading conversions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversions(currentPage);
  }, [currentPage]);

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("approved") || statusLower === "approved") {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    }
    if (statusLower.includes("pending") || statusLower === "pending") {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
    if (statusLower.includes("rejected") || statusLower === "rejected") {
      return "bg-red-500/20 text-red-400 border-red-500/30";
    }
    return "bg-[#2d1f3f] text-[#8E94A4] border-white/10";
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-manrope font-bold text-[32px] md:text-[40px] leading-tight text-white mb-2">
          Station Conversions
        </h1>
        <p className="font-manrope font-medium text-[15px] md:text-[16px] text-[#8E94A4]">
          View and manage conversion requests assigned to your station
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-full p-4 bg-red-500/20 border border-red-500/30">
          <p className="font-manrope font-medium text-[14px] text-red-400 text-center">
            {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-[#8E94A4] font-manrope">Loading conversions...</div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-2xl bg-[#251a34] border border-white/10 backdrop-blur-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left font-manrope font-semibold text-[14px] text-white">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left font-manrope font-semibold text-[14px] text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-manrope font-semibold text-[14px] text-white">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <p className="font-manrope font-medium text-[15px] text-[#8E94A4]">
                          No conversions found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    conversions.map((conversion) => (
                      <tr
                        key={conversion.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 font-manrope font-medium text-[14px] text-white">
                          {conversion.id?.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-manrope font-semibold border ${getStatusColor(
                              conversion.status
                            )}`}
                          >
                            {conversion.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-manrope font-medium text-[14px] text-[#8E94A4]">
                          {conversion.createdAt
                            ? new Date(conversion.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="font-manrope font-medium text-[14px] text-[#8E94A4]">
                Showing {conversions.length} of {total} conversions
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full border border-white/20 text-white font-manrope font-semibold text-[14px] hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-full font-manrope font-semibold text-[14px] transition-all ${
                            currentPage === page
                              ? "bg-gradient-to-r from-[#762FB8] to-[#9B4DE0] text-white"
                              : "border border-white/20 text-white hover:bg-white/10"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="px-2 text-[#8E94A4] font-manrope"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-full border border-white/20 text-white font-manrope font-semibold text-[14px] hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

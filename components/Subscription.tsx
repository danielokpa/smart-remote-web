"use client";
import Image from "next/image";
import { useState } from "react";

export default function Subscription() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter a valid email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Subscription successful! Check your email 🎉");
        setEmail("");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch {
      setMessage("Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="subscription" className="w-full flex justify-center bg-[#11021f] py-12 md:py-16 px-4 sm:px-6 md:px-8">

      {/* mobile */}
      <div className="md:hidden relative w-full rounded-2xl bg-[#251a34] shadow-lg overflow-hidden flex flex-col items-center py-12 px-4">

        <div
          className="absolute w-[60%] aspect-square top-16 right-0 opacity-50 rounded-full blur-[100px] z-0"
          style={{
            background:
              "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117,31,198,0.656447) 38.28%, rgba(78,21,131,0) 100%)",
          }}
        />

        <div className="w-full text-center flex flex-col gap-4 z-10">
          <p className="font-manrope font-semibold text-[28px] leading-tight text-white">
            Subscribe to get updates
          </p>

          <p className="font-manrope font-normal text-[14px] leading-relaxed text-[#E0E0E0]">
            Would you like us to send you regular updates about product features, promotions, and security updates?
          </p>
        </div>

        <div className="w-full mt-6 relative z-10">
          <div className="relative w-full flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full p-4 bg-[#2d1f3f] border border-transparent text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none"
            />

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full rounded-full p-4 bg-white text-[#762FB8] font-manrope font-bold text-[14px] hover:bg-white/90 transition-all text-center"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>

            {message && (
              <p className="text-center text-sm text-white">{message}</p>
            )}
          </div>
        </div>
      </div>

      {/* desktop */}
      <div className="hidden md:flex relative w-full max-w-[1240px] rounded-[50px] bg-[#251a34] shadow-lg overflow-hidden flex-col items-center py-16 sm:py-20">

        <div className="absolute -top-16 sm:-top-24 left-1/2 -translate-x-1/2 w-[150%] h-[150%] pointer-events-none">
          <Image
            src="/images/subscription/Background-pattern.png"
            alt="Subscription Background"
            fill
            className="object-cover"
          />
        </div>

        <div
          className="absolute w-[60%] aspect-square top-16 right-10 opacity-50 rounded-full blur-[100px] z-0"
          style={{
            background:
              "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117,31,198,0.656447) 38.28%, rgba(78,21,131,0) 100%)",
          }}
        />

        <div className="w-full max-w-3xl text-center flex flex-col gap-4 z-10 px-4">
          <p className="font-manrope font-semibold text-6xl leading-tight text-white">
            Subscribe to get updates
          </p>

          <p className="font-manrope font-normal text-lg leading-relaxed text-[#E0E0E0]">
            Would you like us to send you regular updates about product features, promotions, and security updates?
          </p>
        </div>

        <div className="w-full max-w-xl mt-8 relative z-10 px-4">
          <div className="relative w-full flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full p-4 pr-32 bg-[#2d1f3f] text-white placeholder:text-[#8E94A4] font-manrope text-center outline-none"
            />

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="absolute right-1 px-8 py-4 rounded-full bg-white text-[#762FB8] font-manrope font-bold hover:bg-white/90 transition-all"
            >
              {loading ? "..." : "Subscribe"}
            </button>
          </div>

          {message && (
            <p className="text-center text-sm text-white mt-3">{message}</p>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";

export default function QuickActionCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 shadow-2xl">
      <p className="font-manrope font-bold text-white text-[18px]">{title}</p>
      <p className="font-manrope text-[#8E94A4] text-[13px] mt-2">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-3 bg-gradient-to-r from-[#762FB8] to-[#9B4DE0] text-white font-manrope font-bold text-[15px] hover:from-[#8A3AC7] hover:to-[#AB5DF0] transition"
      >
        {cta}
      </Link>
    </div>
  );
}

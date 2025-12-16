"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Footer() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const linkColumns = [
    {
      title: "Home",
      links: [
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Safety", href: "#features" },
        { label: "Contact", href: "#subscription" },
        { label: "FAQ's", href: "#faq" },
      ]
    },
    {
      title: "App",
      links: [
        { label: "Features", href: "#features" },
        { label: "Wallet", href: "#features" }
      ]
    },
    {
      title: "Contact",
      links: [
        { label: "info@peppcruise.com", href: "mailto:info@peppcruise.com", isContact: true },
        { label: "+234 703 835 5876", href: "tel:+2347038355876", isContact: true }
      ]
    }
  ]

  const socialIcons = [
    { href: "https://www.facebook.com", src: "/images/footer/facebook.png", alt: "facebook" },
    { href: "https://www.linkedin.com", src: "/images/footer/linkedIn.png", alt: "linkedin" },
    { href: "https://www.instagram.com", src: "/images/footer/Instagram.png", alt: "instagram" },
    { href: "https://www.twitter.com", src: "/images/footer/twitter.png", alt: "twitter" },
  ]

  return (
    <section id="footer" className="w-full bg-[#2f0952] flex flex-col items-center text-left pt-8 md:pt-12 pb-6 px-4 sm:px-6 lg:px-24">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">

        <motion.div
          className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-[20px] w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          
          <div className="flex flex-col gap-4 md:gap-2 flex-1">
            <motion.div className="flex items-center gap-3 md:gap-4" variants={fadeUp}>
              <div className="flex-shrink-0">
                <Image
                  src="/images/footer/footer-logo.png"
                  alt="footer logo"
                  width={42}
                  height={52}
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>
              <h2 className="font-manrope font-bold text-[28px] md:text-[32px] sm:text-[42px] leading-[150%] text-white">
                PEPP Cruise
              </h2>
            </motion.div>

            <motion.div className="w-full sm:w-[309px] font-manrope font-semibold text-[14px] sm:text-[16px] leading-[160%] text-white" variants={fadeUp}>
              Move how you like. Smooth drivers, calm rides, easy arrivals.
            </motion.div>

            <motion.div className="flex flex-row items-center gap-3 md:gap-4 sm:gap-[16px] mt-4 md:mt-6 lg:mt-12" variants={fadeUp}>
              {socialIcons.map(icon => (
                <Link
                  key={icon.alt}
                  href={icon.href}
                  target="_blank"
                  className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] bg-[#371359] rounded-[12px] flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:bg-[#4b1e75]"
                >
                  <Image src={icon.src} alt={icon.alt} width={13} height={20} />
                </Link>
              ))}
            </motion.div>
          </div>

          <motion.div className="flex flex-1 flex-col md:flex-row justify-between gap-6 md:gap-[60px] w-full" variants={fadeUp}>
            <div className="flex flex-col md:flex-row justify-between flex-1 gap-6 md:gap-[60px]">
              {linkColumns.map((col, idx) => (
                <div key={idx} className="flex flex-col gap-2 md:gap-[14px]">
                  <div className="font-manrope font-bold text-[18px] sm:text-[20px] text-white">{col.title}</div>
                  {col.links.map((link, i) => (
                    'isContact' in link && link.isContact ? (
                      <Link
                        key={i}
                        href={link.href}
                        className="font-manrope font-normal text-[15px] md:text-[16px] sm:text-[18px] text-[#9ba0af] hover:text-white transition"
                      >
                        {link.label}
                      </Link>
                    ) : link.href.startsWith('/') ? (
                      <Link
                        key={i}
                        href={link.href}
                        className="font-manrope font-normal text-[15px] md:text-[16px] sm:text-[18px] text-[#9ba0af] hover:text-white transition cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={i}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.querySelector(link.href);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="font-manrope font-normal text-[15px] md:text-[16px] sm:text-[18px] text-[#9ba0af] hover:text-white transition cursor-pointer"
                      >
                        {link.label}
                      </a>
                    )
                  ))}
                </div>
              ))}
            </div>

            <div className="w-full sm:w-[247px] h-auto md:h-[269px] gap-4 md:gap-6 rounded-[16px] border-[1.5px] border-white/8 p-4 md:p-6 bg-white/4 flex flex-col">
              <div className="font-manrope font-semibold text-[16px] sm:text-[18px] text-white mb-2">
                Download our App
              </div>
              <div className="flex flex-col gap-3 md:gap-4">
                {[
                  { src: "/images/footer/google-play-1.png", title: "Google Play", subtitle: "Get It On" },
                  { src: "/images/footer/apple-1.png", title: "App Store", subtitle: "Download on the" },
                ].map((btn, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center justify-center gap-3 rounded-[12px] border-[1.5px] border-white/12 bg-white/8 px-4 md:px-6 py-3 opacity-100 hover:bg-white/10 transition-transform duration-300 hover:scale-105"
                  >
                    <Image src={btn.src} alt={btn.title} width={24} height={24} />
                    <div className="flex flex-col">
                      <p className="font-manrope font-medium text-[11px] md:text-[12px] leading-[170%] tracking-[0.3px] text-[#c8bed1]">{btn.subtitle}</p>
                      <p className="font-manrope font-medium text-[14px] md:text-[16px] leading-[150%] text-white">{btn.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full border-t border-[#401d60] mt-8 pt-4 flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
          viewport={{ once: true }}
        >
          <p className="text-[#401d60] text-sm text-center md:text-left flex-1">
            &copy; {new Date().getFullYear()} Pepp Cruise. All rights reserved.
          </p>
          <div className="flex-1 flex justify-center">
            <Link href="/privacy-policy" className="text-[#401d60] hover:text-white transition">
              Privacy Policy
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            <Link href="/terms-and-conditions" className="text-[#401d60] hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

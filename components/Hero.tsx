"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#features", label: "Safety" },
  { href: "/become-driver", label: "Become a Driver" },
  { href: "#faq", label: "Contact/FAQ" },
];

const HERO_CONTENT = {
  title: "Powering Movement with Clean Energy",
  subtitle: "Affordable EV & CNG Rides",
  location: "Across Nigeria",
  description: "Ride clean. Ride easy. Download to begin",
  availability: "Available for both iOS and Android",
};

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <section id="home" className="relative w-full bg-[#11021f] overflow-hidden">
      {/* Mobile layout */}
      <div className="md:hidden relative z-10 px-5 pt-8 pb-12">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(118,47,184,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(0,255,231,0.15),transparent_40%)]" />

        {/* Top bar (non-sticky) */}
        <div className="relative flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <Image src="/images/navbar-logo.png" alt="PEPPCruise logo" width={28} height={26} className="object-contain" />
            <span className="font-manrope font-bold text-[18px] leading-[150%] text-white">PEPP Cruise</span>
          </div>
        <button
            onClick={() => setIsMenuOpen(true)}
          aria-label="Toggle menu"
            className="w-10 h-10 flex items-center justify-center p-0 bg-transparent border-0"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="20" fill="#9BA0AF" fillOpacity="0.2" />
              <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="white" strokeOpacity="0.3" />
              <path d="M14 15H19C19.2652 15 19.5196 15.1054 19.7071 15.2929C19.8946 15.4804 20 15.7348 20 16C20 16.2652 19.8946 16.5196 19.7071 16.7071C19.5196 16.8946 19.2652 17 19 17H14C13.7348 17 13.4804 16.8946 13.2929 16.7071C13.1054 16.5196 13 16.2652 13 16C13 15.7348 13.1054 15.4804 13.2929 15.2929C13.4804 15.1054 13.7348 15 14 15ZM21 23H26C26.2652 23 26.5196 23.1054 26.7071 23.2929C26.8946 23.4804 27 23.7348 27 24C27 24.2652 26.8946 24.5196 26.7071 24.7071C26.5196 24.8946 26.2652 25 26 25H21C20.7348 25 20.4804 24.8946 20.2929 24.7071C20.1054 24.5196 20 24.2652 20 24C20 23.7348 20.1054 23.4804 20.2929 23.2929C20.4804 23.1054 20.7348 23 21 23ZM14 19H26C26.2652 19 26.5196 19.1054 26.7071 19.2929C26.8946 19.4804 27 19.7348 27 20C27 20.2652 26.8946 20.5196 26.7071 20.7071C26.5196 20.8946 26.2652 21 26 21H14C13.7348 21 13.4804 20.8946 13.2929 20.7071C13.1054 20.5196 13 20.2652 13 20C13 19.7348 13.1054 19.4804 13.2929 19.2929C13.4804 19.1054 13.7348 19 14 19Z" fill="white" />
            </svg>
        </button>
        </div>

        {/* Slide-in menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMenu} />
        <div className="absolute right-0 top-0 h-full w-[280px] bg-[rgba(17,2,31,0.98)] backdrop-blur-md border-l border-[rgba(255,255,255,0.2)] shadow-2xl">
          <div className="flex flex-col h-full pt-20 px-6">
            <button
              onClick={closeMenu}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-white hover:text-[#9b5cff] transition-colors"
              aria-label="Close menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map(({ href, label }) => {
                  if (href.startsWith("/")) {
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMenu}
                      className="font-inter font-bold text-[18px] leading-[150%] transition-colors duration-200 py-2 text-white hover:text-[#9b5cff] cursor-pointer"
                    >
                      {label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      closeMenu();
                      const element = document.querySelector(href);
                      if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className="font-inter font-bold text-[18px] leading-[150%] transition-colors duration-200 py-2 text-white hover:text-[#9b5cff] cursor-pointer"
                  >
                    {label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

        {/* Copy */}
        <div className="relative flex flex-col gap-4 text-left">
          <h1 className="font-manrope font-bold text-[34px] leading-[118%] text-white">
            Powering Movement<br/>with Clean Energy
          </h1>
          <p className="font-manrope font-semibold text-[19px] leading-[150%] text-[#d4d6dd]">
            Affordable EV &amp; CNG Rides<br />Across Nigeria
          </p>
          <p className="font-manrope text-[15px] leading-[150%] text-[#c8cad4]">
            Ride clean. Ride easy. Download to begin
          </p>
        </div>

        {/* CTAs */}
        <div className="relative flex items-center gap-3 mt-4">
          <button className="flex items-center justify-center gap-3 w-[185px] px-5 py-3 rounded-full border border-white/30 bg-transparent text-white hover:bg-white/10 transition-colors">
            <svg width="24" height="24" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="21.0337" cy="21.0337" r="21.0337" fill="white" />
              <g clipPath="url(#clip0_play_m)">
                <path d="M23.1625 19.9638L15.2805 12.0607L25.3087 17.8176L23.1625 19.9638ZM13.224 11.5962C12.7595 11.839 12.4492 12.2819 12.4492 12.8567V28.6166C12.4492 29.1914 12.7601 29.6343 13.224 29.8771L22.3882 20.7346L13.224 11.5962ZM28.4085 19.653L26.3052 18.4353L23.959 20.7386L26.3052 23.042L28.4514 21.8243C29.0942 21.314 29.0942 20.1638 28.4085 19.653ZM15.2811 29.4171L25.3092 23.6602L23.163 21.514L15.2811 29.4171Z" fill="#762FB8" />
              </g>
              <defs>
                <clipPath id="clip0_play_m">
                  <rect width="18.2849" height="18.2849" fill="white" transform="translate(11.5469 11.5952)" />
                </clipPath>
              </defs>
            </svg>
            <span className="font-manrope font-semibold text-[15px]">Play Store</span>
          </button>
          <button className="flex items-center justify-center gap-3 w-[190px] px-5 py-3 rounded-full bg-white text-[#11021f] hover:bg-white/90 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <svg width="24" height="24" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="21.0337" cy="21.0337" r="21.0337" fill="#762FB8" />
              <g clipPath="url(#clip0_app_m)">
                <path d="M20.6422 16.0047C20.4476 14.9437 20.9493 13.8518 21.5535 13.1159C22.2193 12.304 23.362 11.6813 24.3385 11.6129C24.5035 12.7253 24.0495 13.8092 23.4519 14.5758C22.8109 15.3994 21.7087 16.0381 20.6422 16.0047ZM26.3702 19.8494C26.6723 19.0063 27.271 18.2478 28.1996 17.7361C27.2612 16.565 25.9435 15.8851 24.7001 15.8851C23.055 15.8851 22.3595 16.6689 21.2168 16.6689C20.0397 16.6689 19.1467 15.8851 17.7217 15.8851C16.3244 15.8851 14.837 16.7368 13.8937 18.1913C13.5468 18.729 13.3119 19.3969 13.1838 20.1409C12.8282 22.2279 13.3593 24.9463 14.9436 27.36C15.714 28.5312 16.7407 29.8505 18.0821 29.862C19.277 29.8736 19.616 29.098 21.2336 29.09C22.8536 29.0808 23.1606 29.87 24.3539 29.8586C25.6957 29.8473 26.779 28.3873 27.5493 27.2162C28.0978 26.3758 28.3053 25.9513 28.7318 25.0012C26.5631 24.1833 25.6711 21.7936 26.3702 19.8494Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_app_m">
                  <rect width="18.2849" height="18.2849" fill="white" transform="translate(11.7617 11.5952)" />
                </clipPath>
              </defs>
            </svg>
            <span className="font-manrope font-semibold text-[15px] text-black">App Store</span>
          </button>
        </div>

        {/* Phones + availability */}
        <div className="relative mt-10 flex items-end justify-between gap-6">
          <div className="relative flex items-end gap-4">
            <Image
              src="/images/features/phone-solo1.png"
              alt="PEPP phone preview"
              width={180}
              height={360}
              className="drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)]"
            />
        <Image
              src="/images/hero-image.png"
              alt="Ride app screens"
              width={200}
              height={380}
              className="drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)] object-contain"
        />
      </div>

          <div className="flex flex-col items-start text-left gap-2">
            <p className="text-[13px] font-manrope text-[#c8cad4]">
              Available for both<br />ios and android
            </p>
            <div className="flex items-center gap-2 text-[12px] text-[#c8cad4]">
              <Image src="/images/pepp_cruise_p_logo.webp" alt="PEPP Cruise" width={20} height={20} />
              <span>PEPP Cruise</span>
            </div>
            <p className="text-[11px] font-manrope text-[#c8cad4]">© 2025 All rights reserved</p>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block relative w-full mx-auto h-[820px] rotate-0 opacity-100 bg-[#11021f] overflow-hidden">
        <div className="absolute opacity-50 -top-[190px] -left-[120px] w-[1783.87px] h-[1302.88px]">
          <Image src="/images/BG.png" alt="Background" width={1783} height={1302} className="object-cover" />
        </div>

        <div className="absolute top-[569px] rounded-full left-[308px] w-[790px] h-[790px] opacity-100">
          <Image src="/images/Ellipse 21.png" alt="blur" width={790} height={790} className="backdrop-blur-[244.7]" />
        </div>

        <div className="w-[1199px] h-[79px] gap-[18px] opacity-100 absolute top-[60px] left-[124px] rounded-full border-[1.5px] border-[rgba(255,255,255,0.08)] px-[32px] py-[16px] bg-[rgba(255,255,255,0.04)] flex items-center justify-between hidden md:flex z-[9999] select-none pointer-events-auto">
        <div className="flex items-center gap-[18px]">
          <a 
            href="#home"
            onClick={(e) => {
              e.preventDefault();
                const element = document.querySelector("#home");
              if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="flex items-center gap-[18px] cursor-pointer select-none pointer-events-auto"
          >
            <div className="w-[28px] h-[26px] items-center object-contain flex justify-center rounded rounded-2 bg-[#ffffff] opacity-100">
                <Image src="/images/logo-vector.png" alt="logo-vector" width={19} height={15} />
            </div>
            <div className="w-[163px] h-[31px] opacity-100 font-manrope font-bold text-[24px] leading-[150%] tracking-[0px] text-white">
              PEPP Cruise
            </div>
          </a>

          <div className="relative justify-center w-auto h-[19px] gap-[40px] flex opacity-100 pointer-events-auto ml-[30px]">
            {NAV_LINKS.map(({ href, label }) => {
                if (href.startsWith("/")) {
                return (
                  <Link
                    key={href}
                    href={href}
                    className="w-auto h-[19px] opacity-100 font-inter font-regular text-[16px] leading-[100%] tracking-[0%] text-white hover:text-[#9b5cff] cursor-pointer select-none pointer-events-auto"
                  >
                    {label}
                  </Link>
                );
              }
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(href);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className={`w-auto h-[19px] opacity-100 font-inter text-[16px] leading-[100%] tracking-[0%] text-white hover:text-[#9b5cff] cursor-pointer select-none pointer-events-auto ${
                    href === "#home" ? "font-bold" : "font-regular"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>

        <button className="w-[115px] h-[47px] font-medium gap-[8px] text-base items-center justify-center flex opacity-100 rounded-full border-[1.5px] border-[rgba(255,255,255,0.2)] text-white hover:bg-white/10 transition-colors cursor-pointer select-none pointer-events-auto">
          Start Now
        </button>
      </div>

        <div className="absolute top-[199px] left-[130px] w-[906.92px] h-[423.6px] flex gap-[40px]">
          <div className="w-[906.92px] h-[324.17px] flex flex-col gap-[22.09px]">
            <h1 className="w-[679px] left-[124px] font-manrope font-bold text-[64px] leading-[130%] tracking-[-0.5px] text-white">
            {HERO_CONTENT.title}
          </h1>
            <div className="text-gray-200 font-manrope font-bold text-[28px] leading-[150%]">
            {HERO_CONTENT.subtitle}
            <p>{HERO_CONTENT.location}</p>
          </div>
            <p className="font-manrope font-light py-4 text-gray-400 text-[20px] leading-[150%]">
            {HERO_CONTENT.description}
          </p>
          
            <div className="flex gap-4">
            <button className="flex items-center gap-3 px-5 py-3 rounded-full border border-white/20 bg-[#762FB8]/20 hover:bg-[#762FB8]/30 transition-colors cursor-pointer select-none">
              <svg width="35" height="35" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="21.0337" cy="21.0337" r="21.0337" fill="white" />
                <g clipPath="url(#clip0_9803_782)">
                    <path d="M23.1625 19.9638L15.2805 12.0607L25.3087 17.8176L23.1625 19.9638ZM13.224 11.5962C12.7595 11.839 12.4492 12.2819 12.4492 12.8567V28.6166C12.4492 29.1914 12.7601 29.6343 13.224 29.8771L22.3882 20.7346L13.224 11.5962ZM28.4085 19.653L26.3052 18.4353L23.959 20.7386L26.3052 23.042L28.4514 21.8243C29.0942 21.314 29.0942 20.1638 28.4085 19.653ZM15.2811 29.4171L25.3092 23.6602L23.163 21.514L15.2811 29.4171Z" fill="#762FB8" />
                </g>
                <defs>
                  <clipPath id="clip0_9803_782">
                      <rect width="18.2849" height="18.2849" fill="white" transform="translate(11.5469 11.5952)" />
                  </clipPath>
                </defs>
              </svg>
              <span className="font-manrope font-semibold text-white text-[16px]">Play Store</span>
            </button>

            <button className="flex items-center gap-3 px-5 py-3 rounded-full border border-white/20 bg-white hover:bg-white/90 transition-colors cursor-pointer select-none">
              <svg width="35" height="35" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="21.0337" cy="21.0337" r="21.0337" fill="#762FB8" />
                <g clipPath="url(#clip0_9803_788)">
                    <path d="M20.6422 16.0047C20.4476 14.9437 20.9493 13.8518 21.5535 13.1159C22.2193 12.304 23.362 11.6813 24.3385 11.6129C24.5035 12.7253 24.0495 13.8092 23.4519 14.5758C22.8109 15.3994 21.7087 16.0381 20.6422 16.0047ZM26.3702 19.8494C26.6723 19.0063 27.271 18.2478 28.1996 17.7361C27.2612 16.565 25.9435 15.8851 24.7001 15.8851C23.055 15.8851 22.3595 16.6689 21.2168 16.6689C20.0397 16.6689 19.1467 15.8851 17.7217 15.8851C16.3244 15.8851 14.837 16.7368 13.8937 18.1913C13.5468 18.729 13.3119 19.3969 13.1838 20.1409C12.8282 22.2279 13.3593 24.9463 14.9436 27.36C15.714 28.5312 16.7407 29.8505 18.0821 29.862C19.277 29.8736 19.616 29.098 21.2336 29.09C22.8536 29.0808 23.1606 29.87 24.3539 29.8586C25.6957 29.8473 26.779 28.3873 27.5493 27.2162C28.0978 26.3758 28.3053 25.9513 28.7318 25.0012C26.5631 24.1833 25.6711 21.7936 26.3702 19.8494Z" fill="white" />
                </g>
                <defs>
                  <clipPath id="clip0_9803_788">
                      <rect width="18.2849" height="18.2849" fill="white" transform="translate(11.7617 11.5952)" />
                  </clipPath>
                </defs>
              </svg>
              <span className="font-manrope font-semibold text-black text-[16px]">App Store</span>
            </button>
          </div>
        </div>
      </div>

        <div className="absolute top-[553px] left-[1217px] w-[132px] h-[42px]">
          <p className="font-manrope font-bold text-[14px] text-gray-600 leading-[150%] tracking-wide">
          {HERO_CONTENT.availability}
        </p>
      </div>

        <div className="absolute top-[624px] left-[1217px] w-[117.5px] h-[35.95px] flex gap-[5.95px]">
          <Image src="/images/hero-logo.png" alt="App store badges" width={117} height={36} className="object-contain" />
      </div>
      
        <div className="absolute top-[179px] left-[456px] w-[991px] h-[661px] opacity-100">
        <Image
          src="/images/hero-image.png"
          alt="Hero image"
          width={991}
          height={661}
          priority
          className="max-sm:object-contain max-sm:w-full max-sm:h-full"
        />
      </div>
      </div>
    </section>
  );
}


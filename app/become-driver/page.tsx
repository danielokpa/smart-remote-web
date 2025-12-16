"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Footer from "@/components/Footer";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#features", label: "Safety" },
  { href: "/become-driver", label: "Become a Driver" },
  { href: "/#faq", label: "Contact / FAQ" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Mobile Navigation */}
      <nav
        className="
          fixed md:hidden
          top-5
          left-1/2
          -translate-x-1/2
          w-[90%]
          h-[60px]
          flex items-center justify-between
          gap-3
          rounded-full border border-[rgba(255,255,255,0.2)]
          px-4 py-3
          bg-[rgba(255,255,255,0.05)] backdrop-blur-md
          z-[9999] relative pointer-events-auto select-none
        "
      >
        <Link 
          href="/"
          className="flex items-center gap-2 flex-shrink-0 cursor-pointer select-none pointer-events-auto relative z-[10000]"
        >
          <Image
            src="/images/navbar-logo.png"
            alt="PEPPCruise logo"
            width={28}
            height={26}
            className="object-contain"
          />
          <span className="font-manrope font-bold text-[18px] leading-[150%] text-white">
            PEPPCruise
          </span>
        </Link>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="flex flex-col items-center justify-center w-8 h-8 gap-1.5 focus:outline-none flex-shrink-0 pointer-events-auto relative z-[10000]"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
        />
        <div className="absolute right-0 top-0 h-full w-[280px] bg-[rgba(17,2,31,0.98)] backdrop-blur-md border-l border-[rgba(255,255,255,0.2)] shadow-2xl">
          <div className="flex flex-col h-full pt-20 px-6">
            <button
              onClick={closeMenu}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-white hover:text-[#9b5cff] transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map(({ href, label }) => {
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
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="w-[1199px] h-[79px] gap-[18px] opacity-100 absolute top-[60px] left-[124px] rounded-full 
      border-[1.5px] border-[rgba(255,255,255,0.08)] px-[32px] py-[16px] bg-[rgba(255,255,255,0.04)] flex items-center justify-between hidden md:flex z-[9999] select-none pointer-events-auto">
  
        {/* Left side: Logo + Text */}
        <div className="flex items-center gap-[18px]">
          <Link 
            href="/"
            className="flex items-center gap-[18px] cursor-pointer select-none pointer-events-auto"
          >
            <div className="w-[28px] h-[26px] items-center object-contain flex justify-center rounded rounded-2 bg-[#ffffff] opacity-100">
              <Image
                src="/images/logo-vector.png"
                alt="logo-vector"
                width={19}
                height={15}
              />
            </div>

            <div className="w-[163px] h-[31px] opacity-100 font-manrope font-bold text-[24px] leading-[150%] tracking-[0px] text-white">
              PEPP Cruise
            </div>
          </Link>

          <div className="relative justify-center w-auto h-[19px] gap-[40px] flex opacity-100 pointer-events-auto ml-[30px]">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`w-auto h-[19px] opacity-100 font-inter text-[16px] leading-[100%] tracking-[0%] text-white hover:text-[#9b5cff] cursor-pointer select-none pointer-events-auto ${
                  href === "/become-driver" ? "font-bold" : "font-regular"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side: Button */}
        <button className="w-[115px] h-[47px] font-medium gap-[8px] text-base items-center justify-center flex opacity-100 rounded-full border-[1.5px] border-[rgba(255,255,255,0.2)] text-white hover:bg-white/10 transition-colors cursor-pointer select-none pointer-events-auto">
          Start Now
        </button>
      </div>
    </>
  );
};

// Animation wrapper component for smooth entrance effects
const AnimatedSection = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth, mature feel
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade-in animation for immediate entrance
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1.2,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Subtle image animation
const AnimatedImage = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
      transition={{
        duration: 1,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default function BecomeDriverPage() {
  return (
    <main className="relative  min-h-screen overflow-hidden bg-[#11021f] text-white">
      <Navbar />

      <div className="w-full mt-8 pt-[180px] pb-20 px-4 md:px-[124px]">
        {/* Hero Section - Title on left, Tagline and Description on right */}
        <FadeIn delay={0.2}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Title */}
          <div className="flex items-start">
            <h1 className="font-manrope font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-[140%]">
              Become a Pepp<br/>Cruise Driver
            </h1>
          </div>

          {/* Right: Tagline and Description */}
          <div className="flex flex-col gap-6">
            <p className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%]">
              Earn on your schedule. Drive with confidence.
            </p>
            <p className="font-manrope font-medium text-[#8E94A4] text-base w-[600] tracking-[0.2] md:text-lg leading-[165%]">
              Pepp Cruise gives skilled, respectful drivers an opportunity to earn steady income while offering passengers a smooth, secure way to move around the city. Whether you drive an EV or a CNG powered vehicle, there is a seat for you in the ecosystem. You choose when to go online, how long you want to drive, and how fast you want your earnings to grow.
            </p>
          </div>
        </div>
        </FadeIn>

        {/* Main Content Grid */}
        <AnimatedSection delay={0.3}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div className="flex flex-col gap-16">
            {/* Driver Image */}
            <AnimatedImage delay={0.2}>
              <div className="w-full">
                <Image
                  src="/images/become-driver/pepp_driver.png"
                  alt="Pepp Cruise Driver"
                  width={553}
                  height={400}
                  className="w-553 h-auto object-cover"
                />
              </div>
            </AnimatedImage>

            {/* Driver Benefits Section */}
            <div className="flex flex-col mt-18 gap-8">
              <div className="flex flex-col h-[391] mt-2 gap-8">
                <div>
                  <h3 className="font-manrope font-bold  text-white text-xl md:text-2xl leading-[140%] mb-3">
                    Safety First
                  </h3>
                  <p className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                    Verified riders, GPS ride tracking, and a support team that is active and responsive. You're never on the road alone.
                  </p>
                </div>

                <div>
                  <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%] mb-3">
                    Flexible Hours
                  </h3>
                  <p className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                    You decide when to drive. Morning, evening or weekend runs, it's your call.
                  </p>
                </div>

                <div>
                  <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%] mb-3">
                    EV and CNG Advantage
                  </h3>
                  <p className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                    Enjoy lower running costs. If you drive a petrol vehicle, you can easily apply for CNG conversion through the app and save more on fuel over time.
                  </p>
                </div>
              </div>
              
            </div>
          </div>

          {/* Right Column */}
          <div className="flex h-[408] flex-col gap-16">
            {/* Why Drive Section */}
            <div className="flex flex-col gap-8">
              <h2 className="font-manrope font-bold text-white text-2xl md:text-4xl leading-[140%] mb-4">
                Why Drive with <br/>Pepp Cruise?
              </h2>
              
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="font-manrope mt-2 font-bold text-white text-xl md:text-2xl leading-[140%] mb-3">
                    Fair Earnings
                  </h3>
                  <p className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                    Clear rates, transparent payouts, and a wallet system that keeps your earnings at your fingertips.
                  </p>
                </div>

                <div>
                  <h3 className="font-manrope font-bold pt-6 text-white text-xl md:text-2xl leading-[140%] mb-3">
                    Pepp Coin Rewards
                  </h3>
                  <p className="font-manrope font-medium mt-4 w-[634] tracking-[0.2] text-[#8E94A4] text-base leading-[165%]">
                    Earn extra Pepp Coins for completing rides, providing excellent service, and referring other drivers. You can use the coins for fuel, charging, airtime, data and even maintenance support within the Pepp Cruise network.
                  </p>
                </div>
              </div>
            </div>

            {/* EV Charging Image */}
            <AnimatedImage delay={0.2}>
              <div className="w-full mt-10">
                <Image
                  src="/images/become-driver/pepp_car_charging.png"
                  alt="EV Charging"
                  width={616}
                  height={391}
                  className="w-full h-auto object-cover"
                />
              </div>
            </AnimatedImage>
          </div>
        </div>
        </AnimatedSection>
      </div>

      {/* Who Can Join Section */}
      <AnimatedSection delay={0.1}>
        <div className="w-full px-4 md:px-[124px] mt-20 mb-20">
        <div className="relative rounded-2xl overflow-hidden bg-[#11021f] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          {/* Purple gradient on right side - more prominent */}
          <div className="absolute inset-0 bg-gradient-to-l from-[rgba(155,92,255,0.2)] via-[rgba(155,92,255,0.08)] to-transparent pointer-events-none" />
          
          <div className="relative grid grid-cols-1 md:grid-cols-[30%_70%] gap-8 p-8 md:p-12 z-10">
            {/* Left: Heading */}
            <div className="flex items-start">
              <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-[140%]">
                Who Can Join<br/>Pepp Cruise?
              </h2>
            </div>

            {/* Right: Content */}
            <div className="flex items-start">
              <p className="font-manrope font-normal text-white text-base md:text-lg leading-[165%]">
                PeppCruise is open to <strong>both men and women</strong> who are passionate about safe, reliable transportation and want to earn with dignity. We proudly support female driver inclusivity and encourage women to apply – PeppCruise is committed to creating a safe, empowering environment for female drivers.
              </p>
            </div>
          </div>
        </div>
        </div>
      </AnimatedSection>

      {/* Eligibility Requirements Section */}
      <AnimatedSection delay={0.1}>
        <div className="w-full px-4 md:px-[124px] mt-20 mb-20">
        <div className="relative rounded-2xl overflow-hidden bg-[#11021f]">
          <div className="relative p-8 md:p-12">
            {/* Main Title */}
            <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-[140%] mb-8">
              Eligibility Requirements
            </h2>
            
            <div className="flex flex-col gap-6">
              {/* Row 1: Age Requirement & Education Level */}
              <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Age Requirement
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      Must be 25 years or older.
                    </li>
                  </ul>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Education Level
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      Minimum qualification: ND (National Diploma) or higher.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Full-width divider */}
              <div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div>

              {/* Row 2: Valid Driver's License & Guarantor */}
              <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Valid Driver's License
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      A current, verifiable driver's license is required.
                    </li>
                  </ul>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Guarantor
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      One credible guarantor (employed or a verified business owner).
                    </li>
                  </ul>
                </div>
              </div>

              {/* Full-width divider */}
              <div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div>

              {/* Row 3: Smartphone Requirement & Inclusivity */}
              <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Smartphone Requirement
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      A personal smartphone (Android or iOS) capable of running the PeppCruise Driver App.
                    </li>
                  </ul>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Inclusivity
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      Male & Female applicants are welcome.
                    </li>
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      Women are strongly encouraged to join. We prioritize a safe and supportive experience for all female drivers.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Full-width divider */}
              <div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div>

              {/* Row 4: Bonus Qualities (spans full width but aligned to left column) */}
              <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Bonus Qualities (Not Mandatory)
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      Clean driving record
                    </li>
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      Good communication skills
                    </li>
                    <li className="font-manrope font-normal text-whitesmoke text-base leading-[165%]">
                      Courteous, customer-focused personality
                    </li>
                  </ul>
                </div>

                {/* Right Column - Empty to maintain alignment */}
                <div></div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </AnimatedSection>

      {/* What You Get Section */}
      <AnimatedSection delay={0.1}>
        <div className="w-full px-4 md:px-[124px] mt-20 mb-20">
        <div className="w-full">
          {/* Section Title */}
          

          {/* Cards Grid - 2 rows: 2 cards top, 3 cards bottom */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {/* Card 1: Weekly Payouts */}
            <div className="w-full flex justify-center mt-13">
              <h2 className="font-manrope text-center font-bold text-white text-2xl md:text-4xl lg:text-4xl leading-[140%] mb-12">
                What You Get as a <br/>
                <span className="text-[#9BA0AF]">PeppCruise Driver</span>
              </h2>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-[#11021f] pt-6 pr-8 pb-8 pl-6 md:pt-8 md:pr-10 md:pb-10 md:pl-8">
              {/* Purple gradient on right side */}
              <div className="absolute inset-0 bg-gradient-to-l from-[rgba(155,92,255,0.2)] via-[rgba(155,92,255,0.08)] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4 items-start">
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="27.5" stroke="#00FFE7" strokeOpacity="0.2" fill="none"/>
                    <g transform="translate(18, 13.5)">
                      <path d="M2.69333 28.6533V26.9867H0V5.32H6.50667V0H13.4933V5.32H20V26.9867H17.3067V28.6533H15.64V26.9867H4.36V28.6533H2.69333ZM8.17333 5.32H11.8267V1.66667H8.17333V5.32ZM10 14.295C11.4722 14.295 12.91 14.1072 14.3133 13.7317C15.7167 13.3561 17.0567 12.7939 18.3333 12.045V6.98667H1.66667V12.045C2.94444 12.7939 4.285 13.3561 5.68833 13.7317C7.09167 14.1072 8.52889 14.2961 10 14.295ZM9.16667 17.6267V15.9417C7.85111 15.845 6.56778 15.6367 5.31667 15.3167C4.06555 14.9967 2.84889 14.5361 1.66667 13.935V25.32H18.3333V13.9367C17.15 14.5367 15.9333 14.9967 14.6833 15.3167C13.4333 15.6367 12.15 15.845 10.8333 15.9417V17.6283L9.16667 17.6267Z" fill="#00FFE7"/>
                    </g>
                  </svg>
                </div>
                
                <div className="w-full">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Weekly Payouts
                  </h3>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] opacity-80 mt-2">
                    Steady, reliable payments every week, no delays.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Driver Incentives & Bonuses */}
            <div className="relative rounded-2xl overflow-hidden bg-[#11021f] pt-6 pr-8 pb-8 pl-6 md:pt-8 md:pr-10 md:pb-10 md:pl-8">
              {/* Purple gradient on right side */}
              <div className="absolute inset-0 bg-gradient-to-l from-[rgba(155,92,255,0.2)] via-[rgba(155,92,255,0.08)] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4 items-start">
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="27.5" stroke="#00FFE7" strokeOpacity="0.2" fill="none"/>
                    <g transform="translate(18, 13.5)">
                      <path d="M2.69333 28.6533V26.9867H0V5.32H6.50667V0H13.4933V5.32H20V26.9867H17.3067V28.6533H15.64V26.9867H4.36V28.6533H2.69333ZM8.17333 5.32H11.8267V1.66667H8.17333V5.32ZM10 14.295C11.4722 14.295 12.91 14.1072 14.3133 13.7317C15.7167 13.3561 17.0567 12.7939 18.3333 12.045V6.98667H1.66667V12.045C2.94444 12.7939 4.285 13.3561 5.68833 13.7317C7.09167 14.1072 8.52889 14.2961 10 14.295ZM9.16667 17.6267V15.9417C7.85111 15.845 6.56778 15.6367 5.31667 15.3167C4.06555 14.9967 2.84889 14.5361 1.66667 13.935V25.32H18.3333V13.9367C17.15 14.5367 15.9333 14.9967 14.6833 15.3167C13.4333 15.6367 12.15 15.845 10.8333 15.9417V17.6283L9.16667 17.6267Z" fill="#00FFE7"/>
                    </g>
                  </svg>
                </div>
                
                <div className="w-full">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Driver Incentives & Bonuses
                  </h3>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] opacity-80 mt-2">
                    Earn extra income through performance bonuses, peak-hour incentives, and special campaigns.
                  </p>
                </div>
              </div>
            </div>

            

            {/* Card 3: Refer & Earn */}
            <div className="relative rounded-2xl overflow-hidden bg-[#11021f] pt-6 pr-8 pb-8 pl-6 md:pt-8 md:pr-10 md:pb-10 md:pl-8 lg:col-start-1">
              {/* Purple gradient on right side */}
              <div className="absolute inset-0 bg-gradient-to-l from-[rgba(155,92,255,0.2)] via-[rgba(155,92,255,0.08)] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4 items-start">
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="27.5" stroke="#00FFE7" strokeOpacity="0.2" fill="none"/>
                    <g transform="translate(18, 13.5)">
                      <path d="M2.69333 28.6533V26.9867H0V5.32H6.50667V0H13.4933V5.32H20V26.9867H17.3067V28.6533H15.64V26.9867H4.36V28.6533H2.69333ZM8.17333 5.32H11.8267V1.66667H8.17333V5.32ZM10 14.295C11.4722 14.295 12.91 14.1072 14.3133 13.7317C15.7167 13.3561 17.0567 12.7939 18.3333 12.045V6.98667H1.66667V12.045C2.94444 12.7939 4.285 13.3561 5.68833 13.7317C7.09167 14.1072 8.52889 14.2961 10 14.295ZM9.16667 17.6267V15.9417C7.85111 15.845 6.56778 15.6367 5.31667 15.3167C4.06555 14.9967 2.84889 14.5361 1.66667 13.935V25.32H18.3333V13.9367C17.15 14.5367 15.9333 14.9967 14.6833 15.3167C13.4333 15.6367 12.15 15.845 10.8333 15.9417V17.6283L9.16667 17.6267Z" fill="#00FFE7"/>
                    </g>
                  </svg>
                </div>
                
                <div className="w-full">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Refer & Earn
                  </h3>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] opacity-80 mt-2">
                    Refer another driver to PeppCruise and earn a referral reward once they complete their first set of trips.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Safety & Security Support */}
            <div className="relative rounded-2xl overflow-hidden bg-[#11021f] pt-6 pr-8 pb-8 pl-6 md:pt-8 md:pr-10 md:pb-10 md:pl-8">
              {/* Purple gradient on right side */}
              <div className="absolute inset-0 bg-gradient-to-l from-[rgba(155,92,255,0.2)] via-[rgba(155,92,255,0.08)] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4 items-start">
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="27.5" stroke="#00FFE7" strokeOpacity="0.2" fill="none"/>
                    <g transform="translate(18, 13.5)">
                      <path d="M2.69333 28.6533V26.9867H0V5.32H6.50667V0H13.4933V5.32H20V26.9867H17.3067V28.6533H15.64V26.9867H4.36V28.6533H2.69333ZM8.17333 5.32H11.8267V1.66667H8.17333V5.32ZM10 14.295C11.4722 14.295 12.91 14.1072 14.3133 13.7317C15.7167 13.3561 17.0567 12.7939 18.3333 12.045V6.98667H1.66667V12.045C2.94444 12.7939 4.285 13.3561 5.68833 13.7317C7.09167 14.1072 8.52889 14.2961 10 14.295ZM9.16667 17.6267V15.9417C7.85111 15.845 6.56778 15.6367 5.31667 15.3167C4.06555 14.9967 2.84889 14.5361 1.66667 13.935V25.32H18.3333V13.9367C17.15 14.5367 15.9333 14.9967 14.6833 15.3167C13.4333 15.6367 12.15 15.845 10.8333 15.9417V17.6283L9.16667 17.6267Z" fill="#00FFE7"/>
                    </g>
                  </svg>
                </div>
                
                <div className="w-full">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Safety & Security Support
                  </h3>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] opacity-80 mt-2">
                    In-app emergency tools, rider verification, and 24/7 support to keep you safe on the road.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 5: Grow with a Modern EV Brand */}
            <div className="relative rounded-2xl overflow-hidden bg-[#11021f] pt-6 pr-8 pb-8 pl-6 md:pt-8 md:pr-10 md:pb-10 md:pl-8">
              {/* Purple gradient on right side */}
              <div className="absolute inset-0 bg-gradient-to-l from-[rgba(155,92,255,0.2)] via-[rgba(155,92,255,0.08)] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4 items-start">
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="27.5" stroke="#00FFE7" strokeOpacity="0.2" fill="none"/>
                    <g transform="translate(18, 13.5)">
                      <path d="M2.69333 28.6533V26.9867H0V5.32H6.50667V0H13.4933V5.32H20V26.9867H17.3067V28.6533H15.64V26.9867H4.36V28.6533H2.69333ZM8.17333 5.32H11.8267V1.66667H8.17333V5.32ZM10 14.295C11.4722 14.295 12.91 14.1072 14.3133 13.7317C15.7167 13.3561 17.0567 12.7939 18.3333 12.045V6.98667H1.66667V12.045C2.94444 12.7939 4.285 13.3561 5.68833 13.7317C7.09167 14.1072 8.52889 14.2961 10 14.295ZM9.16667 17.6267V15.9417C7.85111 15.845 6.56778 15.6367 5.31667 15.3167C4.06555 14.9967 2.84889 14.5361 1.66667 13.935V25.32H18.3333V13.9367C17.15 14.5367 15.9333 14.9967 14.6833 15.3167C13.4333 15.6367 12.15 15.845 10.8333 15.9417V17.6283L9.16667 17.6267Z" fill="#00FFE7"/>
                    </g>
                  </svg>
                </div>
                
                <div className="w-full">
                  <h3 className="font-manrope font-bold text-white text-lg md:text-xl leading-[140%]">
                    Grow with a Modern EV Brand
                  </h3>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] opacity-80 mt-2">
                    Be part of an innovative, cleaner, people-first mobility movement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </AnimatedSection>

      {/* How to Join PeppCruise (4 Easy Steps) Section */}
      <AnimatedSection delay={0.1}>
        <div className="w-full px-4 md:px-[124px] mt-20 mb-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 items-start">
          {/* Left Column: Title and Car Image */}
          <div className="flex flex-col items-start">
            <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-[140%] mb-8">
              How to Join<br />PeppCruise<br/><br/>
              <span className="text-[#9BA0AF]">(4 Easy Steps)</span>
            </h2>
            
            {/* Car Image - Full width container, responsive */}
            <AnimatedImage delay={0.2}>
              <div className="w-full flex justify-center items-center mt-8">
                <div className="w-full max-w-[554px]">
                  <Image
                    src="/images/become-driver/driver_pepp_stearing.png"
                    alt="PeppCruise Driver Steering"
                    width={554}
                    height={314}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </AnimatedImage>
          </div>

          {/* Right Column: Steps Text Content */}
          <div className="flex flex-col gap-3">
            {/* Step 1 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%]">
                1. Fill Out the Application Form
              </h3>
              <p className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                Provide your personal details and upload:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                  Driver's license
                </li>
                <li className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                  Valid ID
                </li>
                <li className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                  Passport photograph
                </li>
                <li className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                  Guarantor details
                </li>
                <li className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                  ND or higher qualification
                </li>
              </ul>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div>

            {/* Step 2 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%]">
                2. Screening & Verification
              </h3>
              <p className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                We verify your documents, check your guarantor, and confirm your eligibility.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div>

            {/* Step 3 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%]">
                3. Orientation & Training
              </h3>
              <p className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                Attend a short onboarding session (online or physical) covering:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                  Using the PeppCruise Driver App
                </li>
                <li className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                  Customer service standards
                </li>
                <li className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                  Safety protocols
                </li>
                <li className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                  EV driving basics
                </li>
              </ul>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div>

            {/* Step 4 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%]">
                4. Activate Your Account & Start Driving
              </h3>
              <p className="font-manrope font-normal text-[#8E94A4] text-base leading-[165%]">
                Once approved, you can immediately start receiving ride requests and earning.
              </p>
            </div>
          </div>
        </div>
        </div>
      </AnimatedSection>

      {/* Ready to Start Earning CTA Section */}
      <AnimatedSection delay={0.1}>
        <div className="w-full flex justify-center bg-[#11021f] py-16 px-4 sm:px-6 md:px-8 mt-20">
        <div className="relative w-full max-w-[1240px] rounded-[50px] bg-[#251a34] shadow-lg overflow-hidden flex flex-col items-center py-16 sm:py-20">
          
          {/* Background Pattern - Right Side with fade */}
          <div className="absolute -top-16 sm:-top-24 right-0 w-[70%] h-[150%] opacity-100 pointer-events-none overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="/images/subscription/Background-pattern.png"
                alt="Background Pattern"
                fill
                className="object-cover"
              />
            </div>
            {/* Fade mask for smooth transition - fades from left to right */}
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, rgba(37, 26, 52, 1) 0%, rgba(37, 26, 52, 0.7) 30%, rgba(37, 26, 52, 0.3) 60%, transparent 100%)"
              }}
            ></div>
          </div>

          {/* Vertical Purple Gradient Overlay - Right Side with smooth fade */}
          <div
            className="absolute w-full h-full top-0 right-0 pointer-events-none z-0"
            style={{
              background:
                "linear-gradient(to left, transparent 0%, transparent 40%, rgba(64, 0, 129, 0.2) 50%, rgba(64, 0, 129, 0.4) 70%, rgba(64, 0, 129, 0.6) 100%)",
            }}
          ></div>

          {/* Purple Gradient Blur - Right Side with smooth fade */}
          <div
            className="absolute w-[70%] h-full top-0 right-0 pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse at right center, rgba(138, 37, 233, 0.4) 0%, rgba(117,31,198,0.3) 30%, rgba(78,21,131,0.2) 50%, transparent 100%)",
            }}
          ></div>

          {/* Content */}
          <div className="w-full max-w-3xl text-center flex flex-col gap-4 z-10 px-4">
            <h2 className="font-manrope font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-white">
              Ready to Start Earning <br/>with PeppCruise?
            </h2>

            <p className="font-manrope font-normal text-sm sm:text-base md:text-lg leading-relaxed text-white">
              Drive with purpose and join a community<br/>built For the Love of the People.
            </p>
          </div>

          {/* CTA Button */}
          <div className="w-full max-w-xl mt-8 relative z-10 px-4 flex justify-center">
            <button className="relative px-8 py-4 rounded-full text-white font-manrope font-bold text-sm sm:text-base hover:opacity-90 transition-all flex items-center gap-3 group overflow-hidden border border-[rgba(118,47,184,0.3)] shadow-[0_4px_12px_rgba(118,47,184,0.2)]">
              {/* Gradient Background - lighter purple on left, darker on right */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#9b5cff] to-[#762FB8]"></div>
              
              <span className="relative z-10">Become a Driver</span>
              <div className="relative z-10 w-9 h-9 flex items-center justify-center flex-shrink-0">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="36" rx="18" fill="white"/>
                  <g clipPath="url(#clip0_10149_1718)">
                    <path d="M11.125 18H24.875" stroke="#762FB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.25 12.375L24.875 18L19.25 23.625" stroke="#762FB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_10149_1718">
                      <rect width="20" height="20" fill="white" transform="matrix(-1 0 0 1 28 8)"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </button>
          </div>
        </div>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}


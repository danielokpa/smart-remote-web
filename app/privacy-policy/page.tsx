"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className="font-inter font-bold text-[18px] leading-[150%] transition-colors duration-200 py-2 text-white hover:text-[#9b5cff] cursor-pointer"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="w-[1199px] h-[79px] gap-[18px] opacity-100 absolute top-[60px] left-[124px] rounded-full 
      border-[1.5px] border-[rgba(255,255,255,0.08)] px-[32px] py-[16px] bg-[rgba(255,255,255,0.04)] flex items-center justify-between hidden md:flex z-[9999] select-none pointer-events-auto">
  
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
                className="w-auto h-[19px] opacity-100 font-inter font-regular text-[16px] leading-[100%] tracking-[0%] text-white hover:text-[#9b5cff] cursor-pointer select-none pointer-events-auto"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <button className="w-[115px] h-[47px] font-medium gap-[8px] text-base items-center justify-center flex opacity-100 rounded-full border-[1.5px] border-[rgba(255,255,255,0.2)] text-white hover:bg-white/10 transition-colors cursor-pointer select-none pointer-events-auto">
          Start Now
        </button>
      </div>
    </>
  );
};

const POLICY_SECTIONS = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "how-we-share", label: "How We Share Information" },
  { id: "data-storage", label: "Data Storage and Security" },
  { id: "driver-passenger", label: "Driver and Passenger Data Handling" },
  { id: "cookies", label: "Cookies and Analytics" },
  { id: "data-retention", label: "Data Retention" },
  { id: "your-rights", label: "Your Rights" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "updates-to-this-policy", label: "Updates to This Policy" },
  { id: "contact-us", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("information-we-collect");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#11021f] text-white">
      <Navbar />

      <div className="w-full pt-[180px] pb-20 px-4 md:px-[124px]">
        {/* Title and Effective Date */}
        <div className="w-full text-center mb-12">
          <h1 className="font-manrope font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-[140%] mb-6">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="font-manrope font-normal text-white text-base">Effective</span>
            <div className="px-4 py-2 rounded-lg bg-[#281b35]">
              <span className="font-manrope font-bold text-white text-base">November, 2025</span>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="w-full  mb-16">
          <p className="font-manrope font-normal text-white text-base md:text-lg  mb-4">
            Pepp Cruise International is a digital mobility and energy platform that provides ride-hailing, inter/intra-state transport, EV and CNG charging, vehicle conversion, and airtime/data purchase services through its mobile app and website.
          </p>
          <p className="font-manrope font-normal text-white text-base md:text-lg leading-[165%]">
            This Privacy Policy explains how we collect, use, store, share, and protect your personal information in compliance with the Nigeria Data Protection Act (NDPA) 2023 and the Nigeria Data Protection Regulation (NDPR) 2019.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-32 flex flex-col gap-0">
              {POLICY_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`text-left px-4 py-4 font-manrope font-medium text-base leading-[100%] transition-colors border-b cursor-pointer ${
                    activeSection === section.id
                      ? "text-white border-[#00FFE7]"
                      : "text-[#8E94A4] border-transparent hover:text-white hover:border-[#00FFE7]"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2">
            <div className="prose prose-invert max-w-none">
              {activeSection === "information-we-collect" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    1. Information We Collect
                  </h2>
                  <p className="font-manrope font-medium text-[#8e94a4] text-base leading-[165%] mb-6">
                    We collect the following categories of data:
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%] mb-3">
                        A. Personal Information
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          Name, phone number, email address, date of birth, gender.
                        </li>
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          Government-issued identification (for drivers and CNG operators).
                        </li>
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          Address and location details.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%] mb-3">
                        B. Payment and Transaction Data
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          Card or account details used for ride payments, CNG conversion, charging services, or airtime/data purchases.
                        </li>
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          Payment confirmations, transaction IDs, and billing history.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%] mb-3">
                        C. Ride and Service Data
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          Pick-up and drop-off locations, travel routes, distance, fares, driver and passenger ratings.
                        </li>
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          CNG/EV charging session data (location, energy usage, payment time).
                        </li>
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          Conversion service records (vehicle details, conversion date, warranty information).
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%] mb-3">
                        D. Device and Technical Data
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          IP address, operating system, device model, app usage statistics, cookies, and browser type.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-manrope font-bold text-white text-xl md:text-2xl leading-[140%] mb-3">
                        E. Communication Data
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          Messages between passengers and drivers via the PeppCruise app.
                        </li>
                        <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                          Support inquiries via email, chat, or WhatsApp.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "how-we-use" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    2. How We Use Your Information
                  </h2>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] mb-4">
                    We use the information we collect for the following purposes to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Provide, maintain, and improve our services including ride-hailing, charging, and conversion services
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Process payments and transactions
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Communicate with you about your account, services, and updates
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Ensure safety and security for drivers and passengers
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Personalize your experience and provide relevant content
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Comply with legal obligations and respond to legal requests
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Conduct research and analytics to improve our services
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "how-we-share" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    3. How We Share Information
                  </h2>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] mb-4">
                    Pepp Cruise may share data:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      With drivers and passengers to enable service completion (limited to necessary trip data).
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      With financial institutions or payment processors for secure transactions.
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      With government agencies when required by law or regulatory obligation.
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      With authorized service providers (e.g., IT, analytics, or customer support) under strict confidentiality.
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                       We never sell or rent your data to third parties.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "data-storage" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    4. Data Storage and Security
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      We maintain strict technical and organizational measures to safeguard user information
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Data is encrypted during transfer and storage.
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Only authorized personnel can access personal or cardholder data.
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Servers are hosted in secure, access-controlled environments
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "driver-passenger" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    5. Driver and Passenger Data Handling
                  </h2>
                 <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Drivers’ data (licenses, vehicle details, activity records) is used solely for onboarding, verification, and performance management.
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Passenger data (trip history, payment logs, feedback) is used to enhance service quality and ensure safety.
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Both are stored in compliance with NDPR security standards.
                    </li>
                    
                  </ul>
                </div>
              )}

              {activeSection === "cookies" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    6. Cookies and Analytics
                  </h2>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] mb-4">
                    PeppCruise uses cookies and app analytics tools to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-medium text-[#8e94a4] text-base leading-[165%]">
                      Track user preferences and app performance.
                    </li>
                    <li className="font-manrope font-medium text-[#8e94a4] text-base leading-[165%]">
                      Improve usability and personalization.
                    </li>
                    <li className="font-manrope font-medium text-[#8e94a4] text-base leading-[165%]">
                      Users can disable cookies in browser or app settings.
                    </li>
                  </ul>
                  
                </div>
              )}

              {activeSection === "data-retention" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    7. Data Retention
                  </h2>
                  <p className="font-manrope font-normal text-white text-base leading-[165%]">
                    We retain user data as long as necessary to provide services or as required by law.
                  </p>
                  <p className="font-manrope font-medium text-[#8e94a4] text-base leading-[165%]">
                    Data linked to your PeppCruise account is deleted when you close your account unless required for legal, fraud-prevention, or dispute-resolution purposes.
                  </p>
                </div>
              )}

              {activeSection === "your-rights" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-[#e8eaed] text-2xl md:text-3xl leading-[140%] mb-6">
                    8. Your Rights
                  </h2>
                  <p className="font-manrope font-normal text-[#e8eaed] text-base leading-[165%] mb-4">
                    Under the Nigeria Data Protection Act (2023), you have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Access and obtain a copy of your personal data.
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Request correction or deletion of inaccurate data.
                    </li>
                    <li className="font-manrope font-normal text-[#8e94a4] text-base leading-[165%]">
                      Withdraw consent or object to data processing.
                    </li>
                  </ul>
                  
                </div>
              )}

              {activeSection === "third-party-services" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold [#e8eaed] text-2xl md:text-3xl leading-[140%] mb-6">
                    9. Third-Party Services
                  </h2>
                  <p className="font-manrope font-normal [#e8eaed] text-base leading-[165%]">
                    Our app and website may contain links to third-party platforms (e.g., payment gateways, telecom partners).
                  </p>
                  <p className="font-manrope font-medium text-[#8e94a4] text-base leading-[165%]">
                    We advise reviewing their privacy policies as PeppCruise is not responsible for external data handling.
                  </p>
                </div>
              )}

              {activeSection === "updates-to-this-policy" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold [#e8eaed] text-2xl md:text-3xl leading-[140%] mb-6">
                    10. Updates to This Policy
                  </h2>
                  <p className="font-manrope font-medium [#e8eaed] text-base leading-[165%]">
                    PeppCruise reserves the right to modify or update this Privacy Policy periodically. Updates will be posted on our website and app with the revised effective date.
                  </p>
                </div>
              )}

              {activeSection === "contact-us" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold [#e8eaed] text-2xl md:text-3xl leading-[140%] mb-6">
                    11. Contact Us
                  </h2>
                  <p className="font-manrope font-medium [#e8eaed] text-base leading-[165%]">
                    For any privacy-related concerns or inquiries: <Link href="/" className="font-manrope text-[#00ffe7] font-bold font-medium text-base leading-[165%]">info@peppcruise.com</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}


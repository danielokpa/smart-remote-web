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

const TERMS_SECTIONS = [
  { id: "acceptance-of-terms", label: "Acceptance of Terms" },
  { id: "definitions", label: "Definitions" },
  { id: "scope-of-services", label: "Scope of Services" },
  { id: "user-accounts", label: "User Accounts" },
  { id: "ride-service-payments", label: "Ride and Service Payments" },
  { id: "driver-obligations", label: "Driver Obligations" },
  { id: "user-conduct", label: "User Conduct" },
  { id: "pricing-promotions", label: "Pricing, Promotions & Incentives" },
  { id: "cng-conversion-charging", label: "CNG Conversion & Charging Services" },
  { id: "airtime-data", label: "Airtime and Data Purchases" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "limitation-of-liability", label: "Limitation of Liability" },
  { id: "data-privacy", label: "Data Privacy" },
  { id: "termination", label: "Termination" },
  { id: "dispute-resolution", label: "Dispute Resolution" },
  { id: "governing-law", label: "Governing Law" },
  { id: "amendments", label: "Amendments" },
  { id: "contact-information", label: "Contact Information" },
];

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState("acceptance-of-terms");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#11021f] text-white">
      <Navbar />

      <div className="w-full pt-[170px] pb-20 px-4 md:px-[124px]">
        {/* Title Section */}
        <div className="w-full text-center mb-12">
          <h1 className="font-manrope font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-[140%] mb-6">
            Terms and Conditions
          </h1>
        </div>

        {/* Introduction */}
        <div className="w-full mb-16">
          <p className="font-manrope font-normal text-white text-base md:text-lg leading-[165%] mb-4">
            Welcome to PeppCruise International, a digital mobility and energy service platform that provides ride-hailing, inter/intra-state transport, EV and CNG charging, vehicle conversion, and airtime/data purchase services through its mobile app and website.
          </p>
          <p className="font-manrope font-normal text-white text-base md:text-lg leading-[165%] mb-4">
            By using the PeppCruise mobile application, website, or any related services (including but not limited to ride-hailing, EV/CNG charging, CNG conversion, airtime/data purchases, and other digital services), you agree to be bound by these Terms and Conditions.
          </p>
          <p className="font-manrope font-normal text-white text-base md:text-lg leading-[165%]">
            Please read carefully before using our services.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-32 flex flex-col gap-0">
              {TERMS_SECTIONS.map((section) => (
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
              {activeSection === "acceptance-of-terms" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    1. Acceptance of Terms
                  </h2>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] mb-4">
                    By registering, downloading, or using PeppCruise, you acknowledge that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      You are at least 18 years of age and have the legal capacity to enter into binding agreements.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      You will comply with these Terms and Conditions and all applicable laws and regulations in Nigeria.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      If you do not agree with any part of these terms, you must not use our services.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "definitions" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    2. Definitions
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      <strong>User:</strong> Any person who uses the PeppCruise platform to request rides, purchase services, or access any features of the app.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      <strong>Driver:</strong> Any person who provides ride-hailing services through the PeppCruise platform using their own vehicle.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      <strong>Ride:</strong> A transportation service provided by a Driver to a User through the PeppCruise platform.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      <strong>Service:</strong> Any service offered through the PeppCruise platform, including but not limited to ride-hailing, EV/CNG charging, CNG conversion, and airtime/data purchases.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "scope-of-services" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    3. Scope of Services
                  </h2>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] mb-4">
                    PeppCruise provides the following services:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      On-demand ride hailing
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      EV & CNG charging
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Employment and training programs
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Airtime and data purchase
                    </li>
                  </ul>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] mt-4">
                    Services may vary by location.
                  </p>
                </div>
              )}

              {activeSection === "user-accounts" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    4. User Accounts
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      To use PeppCruise services, you must register an account with a valid phone number, email address, and password.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      You must immediately notify PeppCruise of any unauthorized use of your account or any other breach of security.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise reserves the right to suspend or terminate your account if you violate these Terms and Conditions or engage in fraudulent, abusive, or illegal activity.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "ride-service-payments" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    5. Ride and Service Payments
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      All fares and service charges are displayed in Nigerian Naira (NGN) and are calculated based on distance, time, and service type.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Payment methods include in-app wallet, debit/credit cards, bank transfer, and cash (where applicable).
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Payment is automatically debited from your selected payment method upon completion of a ride or service.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Drivers receive earnings according to the payment structure outlined in their driver agreement.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      If you dispute a charge, you must report it within 48 hours of the transaction.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "driver-obligations" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    6. Driver Obligations
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Drivers must possess a valid driver's license, vehicle registration, and insurance as required by Nigerian law.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Drivers must maintain their vehicles in safe, clean, and roadworthy condition.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Drivers must provide courteous, professional service and comply with all traffic laws and regulations.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Drivers are responsible for their own taxes and compliance with all applicable employment and business regulations.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "user-conduct" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    7. User Conduct
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Users must treat drivers and other users with respect and courtesy.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Users are prohibited from engaging in any illegal, abusive, or disruptive behavior while using PeppCruise services.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Users must not damage vehicles or property, and are liable for any damages caused during a ride.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Smoking, alcohol consumption, and illegal substances are strictly prohibited in vehicles.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "pricing-promotions" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    8. Pricing, Promotions & Incentives
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise reserves the right to modify pricing at any time, with reasonable notice to users.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Promotional offers, discounts, and incentives are subject to terms and conditions specified at the time of the offer.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise may offer Pepp Coin rewards for various activities, which can be used for rides, charging, airtime, data, and other services.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Promotions and incentives may be modified or discontinued at any time without prior notice.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "cng-conversion-charging" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    9. CNG Conversion & Charging Services
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise connects users with certified third-party CNG conversion centers and EV/CNG charging stations.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Users are responsible for verifying the credentials and quality of service providers before engaging their services.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise is not liable for any issues arising from conversion or charging services provided by third parties.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      All conversion and charging transactions are subject to the terms and conditions of the respective service providers.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "airtime-data" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    10. Airtime and Data Purchases
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Airtime and data purchases are processed through third-party service providers.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Transactions are subject to network availability and provider terms.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Refunds for failed transactions will be processed within 24-48 hours.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise is not responsible for network issues or service disruptions from telecommunications providers.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "intellectual-property" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    11. Intellectual Property
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      All content, logos, trademarks, and intellectual property on the PeppCruise platform are owned by PeppCruise International or its licensors.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Users may not copy, modify, distribute, or create derivative works from any PeppCruise content without explicit written permission.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      The PeppCruise app and website are protected by copyright and other intellectual property laws.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "limitation-of-liability" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    12. Limitation of Liability
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise acts as an intermediary platform connecting users with drivers and service providers.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise is not liable for any accidents, injuries, damages, or losses that occur during rides or while using third-party services.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Users and drivers are responsible for their own safety and compliance with applicable laws.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise's liability is limited to the amount paid by the user for the specific service in question.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "data-privacy" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    13. Data Privacy
                  </h2>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] mb-4">
                    Your use of PeppCruise services is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information in compliance with the Nigeria Data Protection Act (NDPA) 2023.
                  </p>
                  <p className="font-manrope font-normal text-white text-base leading-[165%]">
                    By using our services, you consent to the collection and use of your data as described in our Privacy Policy.
                  </p>
                </div>
              )}

              {activeSection === "termination" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    14. Termination
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Either party may terminate their use of PeppCruise services at any time.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise reserves the right to suspend or terminate accounts that violate these Terms and Conditions.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Upon termination, users must cease all use of the platform and may be required to settle any outstanding payments.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "dispute-resolution" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    15. Dispute Resolution
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Any disputes arising from the use of PeppCruise services shall first be addressed through our customer support team.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      If a dispute cannot be resolved through customer support, parties agree to attempt mediation before pursuing legal action.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      These Terms and Conditions are governed by the laws of the Federal Republic of Nigeria.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "governing-law" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    16. Governing Law
                  </h2>
                  <p className="font-manrope font-normal text-white text-base leading-[165%]">
                    These Terms and Conditions are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any legal proceedings arising from these terms shall be subject to the exclusive jurisdiction of Nigerian courts.
                  </p>
                </div>
              )}

              {activeSection === "amendments" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    17. Amendments
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      PeppCruise reserves the right to modify these Terms and Conditions at any time.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Users will be notified of significant changes through the app, email, or website.
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Continued use of PeppCruise services after changes constitutes acceptance of the modified terms.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "contact-information" && (
                <div className="space-y-6">
                  <h2 className="font-manrope font-bold text-white text-2xl md:text-3xl leading-[140%] mb-6">
                    18. Contact Information
                  </h2>
                  <p className="font-manrope font-normal text-white text-base leading-[165%] mb-4">
                    For questions, concerns, or support regarding these Terms and Conditions, please contact us:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Email: support@peppcruise.com
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Phone: [Contact Number]
                    </li>
                    <li className="font-manrope font-normal text-white text-base leading-[165%]">
                      Address: [Company Address]
                    </li>
                  </ul>
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


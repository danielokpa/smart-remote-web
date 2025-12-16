"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Subscription from "./Subscription";

export default function FAQAccordion() {
  const faqs = [
    { 
      question: "What is PEPP Cruise", 
      answer: "Pepp Cruise is a multi-service mobility and clean-energy platform offering affordable ride-hailing, EV & CNG charging, CNG vehicle conversions, Pi integration, and digital services. We connect passengers with safe, reliable drivers, provide free WiFi, and support clean, convenient transportation—built For the Love of the People." 
    },
    { 
      question: "How do I reqyest a Ride", 
      answer: "You can request a ride easily through the Pepp Cruise app. Just open the app, enter your pickup and destination, select your payment method, choose your ride option, and a nearby driver will be on the way." 
    },
    { 
      question: "Can I convert my car through PePPCruise", 
      answer: "Yes, you can. Simply register your vehicle on the Pepp Cruise app, and you'll be connected to certified third-party CNG conversion centers nationwide for safe and reliable conversion." 
    },
    { 
      question: "What is Pepp Coin and how do I earn it?", 
      answer: "Pepp Coin is a digital token within the PeppCruise app with real value. You earn it by riding, referring friends, completing rides, or exploring new app features. Pepp Coins can be used to pay for rides, buy airtime or data, and enjoy other app benefits." 
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const imageRows = [
    [
      { src: "/images/FAQ/car-on-road.png", alt: "car-on-road", width: 520, height: 344 },
      { src: "/images/FAQ/workshop.png", alt: "workshop", width: 520, height: 344 },
      { src: "/images/services/face-up.png", alt: "face-up", width: 325, height: 344 },
    ],
    [
      { src: "/images/FAQ/woman-smiling.png", alt: "woman-smiling", width: 325, height: 344 },
      { src: "/images/FAQ/charge-station.png", alt: "charge-station", width: 520, height: 344 },
      { src: "/images/FAQ/cars-on-queue.png", alt: "cars-on-queue", width: 520, height: 344 },
    ],
  ];

  return (
    <>
      {/* Mobile Layout */}
      <section id="faq" className="md:hidden w-full bg-[#11021f] flex flex-col items-center text-center py-8 px-4">
        <div className="w-full flex flex-col items-center gap-4">
          <p className="font-manrope font-semibold text-[32px] leading-tight text-white text-center">
            Got Questions? We've<br/>Got Answers.
          </p>
          <p className="font-manrope font-medium text-[15px] leading-relaxed text-gray-300 text-center">
            Whether you're new to PEPP Cruise or just curious about the details, here are some of the most common questions we get, answered clearly and simply.
          </p>
        </div>
      </section>

      <section className="md:hidden w-full bg-[#11021f] flex flex-col justify-center items-start gap-6 px-4 py-4 overflow-hidden">
        <div className="relative w-full h-[300px] rounded-2xl overflow-hidden mb-4">
          <Image
            src="/images/FAQ/person-phone.png"
            alt="smiles"
            fill
            className="rounded-2xl object-cover"
          />
        </div>
        <div className="w-full flex flex-col gap-6 text-left">
          {faqs.map(({ question, answer }, idx) => (
            <div key={idx} className="w-full flex flex-col gap-2 border-b border-gray-700 pb-4">
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex justify-between items-center cursor-pointer"
              >
                <p className="font-manrope font-bold text-[18px] text-white">
                  {question}
                </p>
                <motion.svg
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full font-manrope font-normal text-[15px] leading-[24px] text-gray-300"
                  >
                    {answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop Layout */}
      <section id="faq" className="hidden md:flex w-full bg-[#11021f] flex-col items-center text-center py-6 px-4 sm:px-6 lg:px-24">
        <div className="w-full max-w-[1211px] flex flex-col items-center gap-6 opacity-100">
          <p className="font-manrope font-semibold text-4xl sm:text-5xl lg:text-[56px] leading-tight text-white text-center">
            Got Questions? We've <br/>Got Answers.
          </p>
          <p className="font-manrope font-medium text-base sm:text-lg lg:text-[16px] leading-relaxed text-gray-300 text-center max-w-[600px]">
            Whether you're new to PEPP Cruise or just curious about the details, here are some of the most common questions we get, answered clearly and simply.
          </p>
        </div>
      </section>

      <section className="hidden md:flex w-full bg-[#11021f] flex-col lg:flex-row justify-center items-start gap-12 px-6 lg:px-24 py-4 overflow-hidden">
        <div className="w-full max-w-[722px] flex mt-4 flex-col gap-[32px] py-8 text-left opacity-100">
          {faqs.map(({ question, answer }, idx) => (
            <div key={idx} className="w-full flex flex-col gap-2 border-b border-gray-700 pb-4">
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex justify-between items-center cursor-pointer"
              >
                <p className="font-manrope font-bold text-lg sm:text-xl lg:text-2xl text-white">
                  {question}
                </p>
                <motion.svg
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-[578px] font-manrope font-normal text-[16px] leading-[24px] tracking-[0px] opacity-100 text-gray-300"
                  >
                    {answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-[540px] h-[400px] sm:h-[450px] lg:h-[500px]  rounded-2xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-full"
          >
            <Image
              src="/images/FAQ/person-phone.png"
              alt="smiles"
              fill
              className="rounded-2xl relative mt-0 z-10 object-cover"
            />
          </motion.div>
        </div>
      </section>

      <Subscription />

      <section className="w-full bg-[#11021f] flex flex-col relative overflow-hidden py-12 pr-0">
        <div className="relative w-full flex flex-col gap-4">
          {imageRows.map((row, rowIdx) => (
            <motion.div
              key={rowIdx}
              className={`flex w-full gap-4 ${
                rowIdx === 0 
                  ? 'pl-4 sm:pl-6 lg:pl-[20px] justify-start pr-0' 
                  : 'pl-0 pr-0 justify-end lg:pr-[20px]'
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2, duration: 0.6 } },
              }}
            >
              {row.map((card, idx) => (
                <motion.div
                  key={idx}
                  className="flex-1 w-full aspect-[4/3] relative overflow-hidden rounded-2xl border border-[rgba(0,255,231,0.3)]"
                  whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    className="object-cover w-full h-full rounded-2xl"
                  />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

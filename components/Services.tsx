"use client";

import Image from "next/image";
import { motion  } from "framer-motion";

export default function Services() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const servicesTop = [
    {
      img: "/images/services/ev-station.png",
      title: "CNG Vehicle Conversion",
      desc: "We convert petrol vehicles to run on CNG, making daily travel more affordable and cleaner for drivers and fleet owners.",
      aspect: "591/234",
      maxW: "696px",
    }
  ];

  const servicesTopRight =[
    {
      img: "/images/services/road-cars.png",
      title: "EV Ride Service",
      desc: "Book rides in fully electric cars for smooth, quiet and affordable movement across the city.",
      aspect: "488/430",
      maxW: "488px",
    },
  ];

  const servicesBottom = [
    {
      img: "/images/services/face-up.png",
      title: "Technician Training",
      desc: "We train local technicians to service EV and CNG vehicles, opening doors to new skills and jobs in clean mobility.",
    },
    {
      img: "/images/services/car-repairs.png",
      title: "Service and Repair Support",
      desc: "Skilled teams maintain and repair EV and CNG vehicles to keep them running safely every day. Making you comfortable and relieved",
    },
    {
      img: "/images/services/solar-roof.png",
      title: "Green Fleet Program",
      desc: "We help businesses operate cleaner fleets using affordable EV and CNG vehicles with reliable support.",
    },
  ];
  return (
    <section id="services" className="relative w-full pb-16 bg-[#11021F] flex flex-col items-center pt-12 md:pt-20 px-4 md:px-8 lg:px-16"> 
      {/* Mobile CNG Card at top */}
      <div className="md:hidden w-full mb-6">
        <div className="w-full rounded-lg bg-[rgba(47,9,82,0.43)] backdrop-blur-[30px] p-6 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="white" strokeOpacity="0.07"/>
              <path d="M30.0619 20.4411V27.3214L32.8119 25.6252V18.5L30.0619 20.4411ZM34.0916 26.8135L29.375 29.3578L32.8119 31.3943L39 27.857L37.1019 26.7713C36.6428 26.5102 36.1208 26.3762 35.591 26.3835C35.0612 26.3907 34.5432 26.54 34.0916 26.8135ZM32.8119 33.7673L27.3119 30.0346V33.7673L32.8119 37.5V33.7673ZM25.9381 33.9242V28.6774L23.1881 30.0346V37.5L24.6792 36.4745C25.5666 35.9051 25.9381 34.9955 25.9381 33.9242ZM26.8584 26.5469L23.4484 24.6057L17 28.4832L20.0311 30.4255L26.8584 26.5469ZM28.6869 22.5029L22.5 18.5V21.0106C22.5 21.8527 22.9473 22.6332 23.6684 23.047L28.6881 25.9991L28.6869 22.5029Z" fill="#00FFE7"/>
            </svg>
            <p className="font-manrope font-bold text-[20px] leading-[150%] text-white">
              CNG Powered Vehicles
            </p>
          </div>
          <p className="font-manrope font-medium text-[14px] leading-[160%] tracking-[0.2px] text-white">
            A practical step toward cleaner mobility. CNG lowers cost and emissions while keeping rides comfortable and accessible for more people and more communities.
          </p>
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-center w-full"
      >
        <button className="relative w-36 h-9 rounded-full bg-transparent text-white text-sm font-inter font-regular text-center overflow-hidden ring-1 ring-white/15 shadow-none transition-all duration-500 hover:ring-2 hover:ring-[#00FFE7]/40 hover:shadow-[0_0_10px_rgba(0,255,231,0.5)]">
          Services
          <span
            className="absolute bottom-0 left-0 w-full h-px rounded-full animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,255,231,0) 0%, rgba(0,255,231,0.9) 50%, rgba(0,255,231,0) 100%)",
            }}
          />
        </button>
      </motion.div> 
      {/* Mobile horizontal scroll cards */}
      <div className="md:hidden w-full mt-6 overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4 w-max">
          {servicesTop.map(({ img, title, desc }, idx) => (
            <div
              key={idx}
              className="w-[320px] flex-shrink-0 rounded-3xl backdrop-blur-sm relative overflow-hidden"
            >
              <div className="relative h-full rounded-3xl border border-[rgba(0,255,231,0.3)] bg-[rgba(155,160,175,0.3)] backdrop-blur-[4px] flex flex-col overflow-hidden"> 
                <div className="flex justify-center pt-[28px] relative z-[1]">  
                  <Image 
                    src={img} 
                    alt={title} 
                    className="w-full h-[200px] object-cover rounded-[20px]"
                    width={320} 
                    height={200} 
                  />
                </div>   
                <div className="mt-auto w-full rounded-b-3xl bg-[#251a34]/90 p-4 relative z-[1]">
                  <p className="font-manrope font-bold text-[18px] text-[#e4e4e7]">{title}</p>
                  <p className="font-manrope font-medium text-[14px] text-[#888692] mt-2">{desc}</p>
                </div>
              </div>
            </div>
          ))}
          {servicesTopRight.map(({ img, title, desc }, idx) => (
            <div
              key={`right-${idx}`}
              className="w-[320px] flex-shrink-0 rounded-3xl backdrop-blur-sm relative overflow-hidden"
            >
              <div className="relative w-full h-[400px] rounded-3xl border border-[rgba(0,255,231,0.3)] bg-[rgba(155,160,175,0.3)] backdrop-blur-[4px] flex flex-col overflow-hidden"> 
                <div className="flex justify-center items-start pt-[28px] relative z-[1]">               
                  <Image 
                    src={img} 
                    alt={title} 
                    className="w-full h-[250px] object-cover rounded-[20px]" 
                    width={320} 
                    height={250} 
                  />
                </div>
                <div className="mt-auto w-full bg-[#251a34]/90 p-4 rounded-b-3xl relative z-[1]">
                  <p className="font-manrope font-bold text-[18px] text-[#e4e4e7]">{title}</p>
                  <p className="font-manrope font-medium text-[14px] text-[#888692] mt-2">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex mt-12 w-full flex-col overflow-hidden md:flex-row flex-wrap justify-center gap-6 md:gap-8 opacity-100"
      >
        {servicesTop.map(({ img, title, desc, aspect }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: idx * 0.2 } }}
            viewport={{ once: true }}
            className={`flex-1 min-w-[280px] max-w-[696] rounded-3xl backdrop-blur-sm relative aspect-[${aspect}] overflow-hidden`}
          >
            <div className="relative h-full rounded-3xl border border-[rgba(0,255,231,0.3)] bg-[rgba(155,160,175,0.3)] backdrop-blur-[4px] flex flex-col overflow-hidden"> 
              {/*gradient */}
              <div className="pointer-events-none absolute w-[647] h-[647] top-[-323] left-[249] opacity-60 blur-[120px] mix-blend-screen bg-[radial-gradient(circle,_#8A25E9_0%,_rgba(117,31,198,0.6)_40%,_rgba(78,21,131,0)_80%)]">
              </div>
              <div className="flex justify-center pt-[28px] relative z-[1]">  
                <Image 
                  src={img} 
                  alt={title} 
                  className="w-[591px] h-[234px] object-contain rounded-[20px]"
                  width={591} 
                  height={234} 
                />
              </div>   
              <div className="mt-auto w-full rounded-b-3xl bg-[#251a34]/90 p-4 md:p-6 relative z-[1]">
                <p className="font-manrope font-bold text-[1.25rem] text-[#e4e4e7]">{title}</p>
                <p className="font-manrope font-medium text-base text-[#888692] mt-2">{desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
        {servicesTopRight.map(({ img, title, desc, aspect, maxW }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: idx * 0.2 } }}
            viewport={{ once: true }}
            className={`flex-1 min-w-[280px] max-w-[${maxW}] rounded-3xl backdrop-blur-sm relative aspect-[${aspect}] overflow-hidden`}
          >
            <div className="relative w-full max-w-[488px] h-[430px] rounded-3xl border border-[rgba(0,255,231,0.3)] bg-[rgba(155,160,175,0.3)] backdrop-blur-[4px] flex flex-col overflow-hidden"> 
              {/* gradient */}
              <div className="pointer-events-none absolute w-[647] h-[647] top-[-308] left-[21] opacity-60 blur-[120px] mix-blend-screen bg-[radial-gradient(circle,_#8A25E9_0%,_rgba(117,31,198,0.6)_40%,_rgba(78,21,131,0)_80%)]">
              </div>
              <div className="flex justify-center items-start pt-[28px] relative z-[1]">               
                <Image 
                  src={img} 
                  alt={title} 
                  className="w-[90%] h-auto max-h-[234px] object-contain rounded-[20px]" 
                  width={591} 
                  height={234} 
                />
              </div>
              <div className="mt-auto w-full bg-[#251a34]/90 p-4 md:p-6 rounded-b-3xl relative z-[1]">
                <p className="font-manrope font-bold text-[1.25rem] text-[#e4e4e7]">{title}</p>
                <p className="font-manrope font-medium text-base text-[#888692] mt-2">{desc}</p>
              </div>

            </div>
        </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full flex flex-wrap justify-center gap-6 mt-12"
      >
        {servicesBottom.map(({ img, title, desc }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: idx * 0.2 } }}
            viewport={{ once: true }}
            className="flex-1 min-w-[280px] max-w-[384px] rounded-3xl border border-[rgba(0,255,231,0.3)] bg-white/20 backdrop-blur-sm flex flex-col items-center relative overflow-hidden"
          >
            {/* Gradient */}
            <div className="pointer-events-none absolute w-[647] h-[647] top-[-352] left-[70] opacity-60 blur-[120px] mix-blend-screen bg-[radial-gradient(circle,_#8A25E9_0%,_rgba(117,31,198,0.6)_40%,_rgba(78,21,131,0)_80%)]">
              </div>

            <div className="relative w-4/5 h-48 mt-6 flex items-center justify-center rounded-2xl overflow-hidden z-[1]">          
              <Image src={img} alt={title} className="object-contain w-full h-auto" width={321} height={426} />
            </div>
            <div className="w-full bg-[#251a34] rounded-b-3xl mt-6 p-4 relative z-[1]">
              <p className="font-manrope font-bold text-[#e4e4e7] text-lg">{title}</p>
              <p className="font-manrope font-medium text-[#888692] text-base mt-2">{desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

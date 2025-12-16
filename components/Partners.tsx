"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Partners() {
  const partners = [
    {
      src: "/images/nipco.png",
      alt: "NIPCO",
      w: 169.17,
      h: 53.09,
    },
    {
      src: "/images/picng.png",
      alt: "PICNG",
      w: 169.17,
      h: 71.42,
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative w-full flex justify-center items-center bg-[#2f0952] py-4">
      <motion.div
        className="w-full max-w-[1200px] px-5 sm:px-10 flex items-center justify-between gap-6 sm:gap-10 md:gap-16 flex-wrap"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {partners.map((partner, index) => (
          <motion.div
            key={index}
            variants={fadeUp}
            className="flex justify-center items-center"
          >
            <Image
              src={partner.src}
              alt={partner.alt}
              width={partner.w}
              height={partner.h}
              className="object-contain w-[120px] sm:w-[150px] md:w-[170px] h-auto"
            />
          </motion.div>
        ))}

        <motion.div
          className="flex items-center justify-center gap-3 sm:gap-[10px] w-auto h-[50px]"
          variants={fadeUp}
        >
          <Image
            src="/images/chevron.png"
            alt="Chevron Logo"
            width={44.82}
            height={50}
            className="object-contain"
          />
          <Image
            src="/images/chevron-text.png"
            alt="Chevron Text"
            width={74.58}
            height={50}
            className="object-contain"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

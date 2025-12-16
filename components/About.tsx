"use client";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="w-full bg-[#11021F] flex flex-col items-center pt-20 pb-12 relative px-4 sm:px-6 md:px-8 lg:px-16">

      {/* Top Button */}
      <div className="flex justify-center w-full">
        <button className="relative w-36 h-9 rounded-full bg-transparent text-white text-sm font-inter font-regular text-center align-middle overflow-hidden ring-1 ring-white/15 transition-all duration-500 hover:ring-2 hover:ring-[#00FFE7]/40 hover:shadow-[0_0_10px_rgba(0,255,231,0.5)]">
          About
          <span
            className="absolute bottom-0 left-0 w-full h-px rounded-full animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,255,231,0) 0%, rgba(0,255,231,0.9) 50%, rgba(0,255,231,0) 100%)",
            }}
          ></span>
        </button>
      </div>

      {/* About Text Section */}
      {/* Mobile layout */}
      <div className="md:hidden w-full max-w-[560px] flex flex-col mt-12 gap-6 text-left">
        <p className="font-manrope font-bold text-[32px] leading-[120%] tracking-[-0.5px] text-white">
          About<br />PEPP Cruise
        </p>

        <div className="flex flex-col gap-4">
          <p className="font-manrope font-medium text-[#c8cad4] text-[15px] leading-[170%] tracking-[0.2px]">
            PEPP Cruise is a clean mobility company using EV and CNG powered transportation to make everyday movement across Nigeria easier,
            more affordable and better for the environment. We are building a modern network of rides, conversion services, charging hubs and skilled
            technicians who support a cleaner way to move.
          </p>
          <p className="font-manrope font-semibold text-[15px] leading-[170%] tracking-[0.2px] text-white">
            We focus on solutions that work in real communities. Good transportation should feel accessible, safe and reliable for everyone.
          </p>
        </div>

        <div className="mt-8 w-full">
          <Image
            src="/images/about/cars-on-queue.png"
            alt="Clean mobility street view"
            width={760}
            height={900}
            className="w-full h-auto rounded-2xl object-cover"
            priority
          />
      </div>

        {/* Mobile mission block */}
        <div className="mt-10 w-full flex flex-col gap-3">
          <Image
            src="/images/about/road-cars1.png"
            alt="Road view"
            width={760}
            height={900}
            className="w-full h-auto rounded-2xl object-cover"
          />
          <h3 className="font-manrope font-bold text-[24px] leading-[130%] text-white mt-2">
            What PEPP means
          </h3>
          <p className="font-manrope font-semibold text-[15px] leading-[165%] tracking-[0.2px] text-white">
            PEPP stands for Poverty Empowerment Pilot Program.
          </p>
          <p className="font-manrope font-medium text-[15px] leading-[165%] tracking-[0.2px] text-[#c8cad4]">
            Our purpose is to create opportunities that improve livelihoods. We build capacity, encourage skill development and support job creation through green mobility.
          </p>
        </div>

        {/* Our Mission Card - Mobile */}
        <div className="mt-8 w-full rounded-2xl p-6 flex flex-col gap-4 bg-[#1a0d2e]"
          style={{
            background: 'radial-gradient(ellipse at bottom right, rgba(118, 47, 184, 0.4) 0%, rgba(26, 13, 46, 0.8) 50%, #1a0d2e 100%)'
          }}
        >
          <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#00FFE7" strokeOpacity="0.2"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M30 26.3333C27.975 26.3333 26.3333 27.975 26.3333 30C26.3333 32.025 27.975 33.6667 30 33.6667C32.025 33.6667 33.6667 32.025 33.6667 30C33.6667 29.4937 34.0771 29.0833 34.5833 29.0833C35.0896 29.0833 35.5 29.4937 35.5 30C35.5 33.0376 33.0376 35.5 30 35.5C26.9624 35.5 24.5 33.0376 24.5 30C24.5 26.9624 26.9624 24.5 30 24.5C30.5063 24.5 30.9167 24.9104 30.9167 25.4167C30.9167 25.9229 30.5063 26.3333 30 26.3333Z" fill="#00FFE7"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M30.0013 21.7501C25.445 21.7501 21.7513 25.4437 21.7513 30.0001C21.7513 34.5564 25.445 38.2501 30.0013 38.2501C34.5577 38.2501 38.2513 34.5564 38.2513 30.0001C38.2513 29.4338 38.1944 28.8818 38.0863 28.3491C37.9855 27.853 38.3061 27.3691 38.8022 27.2684C39.2984 27.1677 39.7822 27.4883 39.8829 27.9844C40.0153 28.6364 40.0846 29.3106 40.0846 30.0001C40.0846 35.569 35.5702 40.0834 30.0013 40.0834C24.4324 40.0834 19.918 35.569 19.918 30.0001C19.918 24.4312 24.4324 19.9167 30.0013 19.9167C30.6907 19.9167 31.3649 19.9861 32.017 20.1184C32.5131 20.2191 32.8337 20.703 32.733 21.1991C32.6323 21.6953 32.1484 22.0158 31.6523 21.9151C31.1196 21.807 30.5676 21.7501 30.0013 21.7501Z" fill="#00FFE7"/>
              <path d="M37.4623 20.9047C37.3178 20.3509 36.8703 20.0109 36.3902 19.9342C35.9275 19.8603 35.4587 20.0246 35.1237 20.3596L34.0701 21.4132C32.9065 22.5768 32.8091 24.0107 33.1987 25.5039L29.3505 29.352C28.9925 29.71 28.9925 30.2904 29.3505 30.6484C29.7085 31.0064 30.2889 31.0064 30.6469 30.6484L34.495 26.8002C35.9881 27.1898 37.4221 27.0924 38.5857 25.9288L39.6393 24.8752C39.9743 24.5402 40.1386 24.0714 40.0647 23.6087C39.988 23.1286 39.648 22.6811 39.0942 22.5366L37.8 22.1989L37.4623 20.9047Z" fill="#00FFE7"/>
            </svg>
          </div>
          
          <h3 className="font-manrope font-bold text-[24px] leading-[140%] tracking-[0.2px] text-white">
            Our Mission
          </h3>
          
          <p className="font-manrope font-medium text-[15px] leading-[160%] tracking-[0.2px] text-[#c8cad4]">
            To provide clean, affordable and community-powered transportation that supports a greener future for Nigeria.
          </p>
          
          <p className="font-manrope font-semibold text-[13px] leading-[165%] tracking-[0.2px] text-[#00FFE7] cursor-pointer mt-2">
            Learn More About Our Work
          </p>
        </div>

        {/* Electric Vehicles and CNG Cards - Mobile */}
        <div className="mt-8 w-full flex flex-col gap-6">
          {/* Electric Vehicles Card */}
          <div className="w-full rounded-lg bg-[rgba(47,9,82,0.43)] backdrop-blur-[30px] p-6 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="white" strokeOpacity="0.07"/>
                <path d="M34.3433 18.8426C34.16 18.3017 33.6467 17.9167 33.0417 17.9167H22.9583C22.3533 17.9167 21.8492 18.3017 21.6567 18.8426L19.75 24.3334V31.6667C19.75 32.1709 20.1625 32.5834 20.6667 32.5834H21.5833C22.0875 32.5834 22.5 32.1709 22.5 31.6667V30.7501H33.5V31.6667C33.5 32.1709 33.9125 32.5834 34.4167 32.5834H35.3333C35.8375 32.5834 36.25 32.1709 36.25 31.6667V24.3334L34.3433 18.8426ZM23.2792 19.7501H32.7117L33.7017 22.6009H22.2892L23.2792 19.7501ZM34.4167 28.9167H21.5833V24.3334H34.4167V28.9167Z" fill="#00FFE7"/>
                <path d="M23.875 28C24.6344 28 25.25 27.3844 25.25 26.625C25.25 25.8656 24.6344 25.25 23.875 25.25C23.1156 25.25 22.5 25.8656 22.5 26.625C22.5 27.3844 23.1156 28 23.875 28Z" fill="#00FFE7"/>
                <path d="M32.125 28C32.8844 28 33.5 27.3844 33.5 26.625C33.5 25.8656 32.8844 25.25 32.125 25.25C31.3656 25.25 30.75 25.8656 30.75 26.625C30.75 27.3844 31.3656 28 32.125 28Z" fill="#00FFE7"/>
                <path d="M23.418 35.3333H27.0846V33.5L32.5846 36.25H28.918V38.0833L23.418 35.3333Z" fill="#00FFE7"/>
              </svg>
              <p className="font-manrope font-bold text-[20px] leading-[150%] text-white">
                Electric Vehicles
              </p>
            </div>
            <p className="font-manrope font-medium text-[14px] leading-[160%] tracking-[0.2px] text-white">
              Designed for cleaner movement in busy cities. Quiet, efficient and friendly to the environment. EV rides support a future where transportation feels lighter and more responsible.
            </p>
          </div>

          {/* CNG Powered Vehicles Card */}
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
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex w-full max-w-[1199px] flex-col items-start mt-16 gap-16">
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16">
          <p className="font-manrope font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[130%] tracking-[-0.5px] text-white text-center lg:text-left">
            About <br /> PEPP Cruise
          </p>

          <div className="text-left flex-1 flex-col">
            <p className="font-manrope pl-40 font-medium text-[#8e94a4] text-sm sm:text-base md:text-base lg:text-lg leading-[160%] tracking-[0.2px] text-justify">
              PEPP Cruise is a clean mobility company using EV and CNG powered transportation to make everyday movement across Nigeria easier,
              more affordable and better for the environment. We are building a modern network of rides, conversion services, charging hubs and skilled
              technicians who support a cleaner way to move.
            </p>
            <p className="font-manrope pl-40 font-semibold text-sm sm:text-base md:text-base lg:text-lg leading-[160%] tracking-[0.2px] text-white text-justify mt-4">
              We focus on solutions that work in real communities. Good transportation should feel accessible, safe and reliable for everyone.
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
          <div className="w-full lg:w-[519px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/images/about/road-cars1.png"
            alt="Cars-On-Road"
            width={519}
            height={568}
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>

        <div className="flex-1 flex flex-col justify-start">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[130%] tracking-[-0.5px] text-white mb-2">
            What PEPP means
          </h2>
          <p className="font-manrope font-semibold text-sm sm:text-base md:text-base lg:text-base text-gray-100 leading-[160%] tracking-[0.2px] mb-2">
            PEPP stands for Poverty Empowerment Pilot Program.
          </p>
          <p className="font-manrope font-medium text-sm sm:text-base md:text-base lg:text-base text-[#8e94a4] leading-[160%] tracking-[0.2px]">
            Our purpose is to create opportunities that improve livelihoods. We build capacity, encourage skill development and support job creation through green mobility.
          </p>
            <div
              className="relative w-full h-auto md:h-[336px] mt-8 md:mt-19 rounded-2xl p-6 md:p-8 flex flex-col overflow-hidden bg-[#1a0d2e]"
            style={{
                background:
                  "radial-gradient(ellipse at bottom right, rgba(118, 47, 184, 0.4) 0%, rgba(26, 13, 46, 0.8) 50%, #1a0d2e 100%)",
            }}
          >
            <div className="relative z-10 flex flex-col gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#00FFE7" strokeOpacity="0.2" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M30 26.3333C27.975 26.3333 26.3333 27.975 26.3333 30C26.3333 32.025 27.975 33.6667 30 33.6667C32.025 33.6667 33.6667 32.025 33.6667 30C33.6667 29.4937 34.0771 29.0833 34.5833 29.0833C35.0896 29.0833 35.5 29.4937 35.5 30C35.5 33.0376 33.0376 35.5 30 35.5C26.9624 35.5 24.5 33.0376 24.5 30C24.5 26.9624 26.9624 24.5 30 24.5C30.5063 24.5 30.9167 24.9104 30.9167 25.4167C30.9167 25.9229 30.5063 26.3333 30 26.3333Z"
                      fill="#00FFE7"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M30.0013 21.7501C25.445 21.7501 21.7513 25.4437 21.7513 30.0001C21.7513 34.5564 25.445 38.2501 30.0013 38.2501C34.5577 38.2501 38.2513 34.5564 38.2513 30.0001C38.2513 29.4338 38.1944 28.8818 38.0863 28.3491C37.9855 27.853 38.3061 27.3691 38.8022 27.2684C39.2984 27.1677 39.7822 27.4883 39.8829 27.9844C40.0153 28.6364 40.0846 29.3106 40.0846 30.0001C40.0846 35.569 35.5702 40.0834 30.0013 40.0834C24.4324 40.0834 19.918 35.569 19.918 30.0001C19.918 24.4312 24.4324 19.9167 30.0013 19.9167C30.6907 19.9167 31.3649 19.9861 32.017 20.1184C32.5131 20.2191 32.8337 20.703 32.733 21.1991C32.6323 21.6953 32.1484 22.0158 31.6523 21.9151C31.1196 21.807 30.5676 21.7501 30.0013 21.7501Z"
                      fill="#00FFE7"
                    />
                    <path d="M37.4623 20.9047C37.3178 20.3509 36.8703 20.0109 36.3902 19.9342C35.9275 19.8603 35.4587 20.0246 35.1237 20.3596L34.0701 21.4132C32.9065 22.5768 32.8091 24.0107 33.1987 25.5039L29.3505 29.352C28.9925 29.71 28.9925 30.2904 29.3505 30.6484C29.7085 31.0064 30.2889 31.0064 30.6469 30.6484L34.495 26.8002C35.9881 27.1898 37.4221 27.0924 38.5857 25.9288L39.6393 24.8752C39.9743 24.5402 40.1386 24.0714 40.0647 23.6087C39.988 23.1286 39.648 22.6811 39.0942 22.5366L37.8 22.1989L37.4623 20.9047Z" fill="#00FFE7" />
                </svg>
              </div>
              
              <h3 className="font-manrope font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[140%] tracking-[0.2px] text-white">
                  Our Mission
                </h3>
              
              <p className="font-manrope font-medium text-sm sm:text-base md:text-base lg:text-base text-[#8e94a4] leading-[160%] tracking-[0.2px]">
                  To provide clean, affordable and community-powered transportation that supports a greener future for Nigeria.
                </p>
              
              <p className="font-manrope font-semibold text-xs sm:text-sm md:text-sm lg:text-sm text-[#00FFE7] leading-[165%] tracking-[0.2px] cursor-pointer mt-2">
                  Learn More About Our Work
                </p>
            </div>
          </div>
        </div>
      </div>

        <div className="w-full max-w-[1199px] relative">
        <Image
          src="/images/about/cars-on-queue.png"
          alt="cars-on-queue"
          width={1199}
          height={605}
          className="w-full h-auto rounded-2xl object-cover"
        />

        <div className="absolute bottom-4 right-4 z-20">
            <img src="/images/pepp_cruise_p_logo.webp" alt="PEPP Cruise P Logo" />
        </div>

        <div className="absolute top-64 sm:top-72 md:top-80 left-4 md:left-8 lg:left-12 w-full flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-10 z-10">
          <div className="w-full lg:w-[429px] h-auto md:h-[255px] rounded-lg bg-[rgba(47,9,82,0.43)] backdrop-blur-[30px] p-4 md:p-6 flex flex-col justify-start gap-2">
            <div className="flex items-center gap-4">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="white" strokeOpacity="0.07" />
                  <path d="M34.3433 18.8426C34.16 18.3017 33.6467 17.9167 33.0417 17.9167H22.9583C22.3533 17.9167 21.8492 18.3017 21.6567 18.8426L19.75 24.3334V31.6667C19.75 32.1709 20.1625 32.5834 20.6667 32.5834H21.5833C22.0875 32.5834 22.5 32.1709 22.5 31.6667V30.7501H33.5V31.6667C33.5 32.1709 33.9125 32.5834 34.4167 32.5834H35.3333C35.8375 32.5834 36.25 32.1709 36.25 31.6667V24.3334L34.3433 18.8426ZM23.2792 19.7501H32.7117L33.7017 22.6009H22.2892L23.2792 19.7501ZM34.4167 28.9167H21.5833V24.3334H34.4167V28.9167Z" fill="#00FFE7" />
                  <path d="M23.875 28C24.6344 28 25.25 27.3844 25.25 26.625C25.25 25.8656 24.6344 25.25 23.875 25.25C23.1156 25.25 22.5 25.8656 22.5 26.625C22.5 27.3844 23.1156 28 23.875 28Z" fill="#00FFE7" />
                  <path d="M32.125 28C32.8844 28 33.5 27.3844 33.5 26.625C33.5 25.8656 32.8844 25.25 32.125 25.25C31.3656 25.25 30.75 25.8656 30.75 26.625C30.75 27.3844 31.3656 28 32.125 28Z" fill="#00FFE7" />
                  <path d="M23.418 35.3333H27.0846V33.5L32.5846 36.25H28.918V38.0833L23.418 35.3333Z" fill="#00FFE7" />
              </svg>
              <p className="font-manrope font-bold text-lg sm:text-xl md:text-xl lg:text-2xl leading-[150%] text-white">
                Electric Vehicles
              </p>
            </div>
            <p className="font-manrope font-medium text-xs sm:text-sm md:text-sm lg:text-base leading-[160%] tracking-[0.2px] text-white mt-2">
                Designed for cleaner movement in busy cities.<br />Quiet, efficient and friendly to the environment.<br />EV rides support a future where transportation<br /> feels lighter and more responsible.
            </p>
          </div>

          <div className="w-full lg:w-[437px] h-auto md:h-[255px] rounded-lg bg-[rgba(47,9,82,0.43)] backdrop-blur-[30px] p-4 md:p-6 flex flex-col justify-start gap-2">
            <div className="flex items-center gap-4">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="white" strokeOpacity="0.07" />
                  <path d="M30.0619 20.4411V27.3214L32.8119 25.6252V18.5L30.0619 20.4411ZM34.0916 26.8135L29.375 29.3578L32.8119 31.3943L39 27.857L37.1019 26.7713C36.6428 26.5102 36.1208 26.3762 35.591 26.3835C35.0612 26.3907 34.5432 26.54 34.0916 26.8135ZM32.8119 33.7673L27.3119 30.0346V33.7673L32.8119 37.5V33.7673ZM25.9381 33.9242V28.6774L23.1881 30.0346V37.5L24.6792 36.4745C25.5666 35.9051 25.9381 34.9955 25.9381 33.9242ZM26.8584 26.5469L23.4484 24.6057L17 28.4832L20.0311 30.4255L26.8584 26.5469ZM28.6869 22.5029L22.5 18.5V21.0106C22.5 21.8527 22.9473 22.6332 23.6684 23.047L28.6881 25.9991L28.6869 22.5029Z" fill="#00FFE7" />
              </svg>
              <p className="font-manrope font-bold text-lg sm:text-xl md:text-xl lg:text-2xl leading-[150%] text-white">
                CNG Powered Vehicles
              </p>
            </div>
            <p className="font-manrope font-medium text-xs sm:text-sm md:text-sm lg:text-base leading-[160%] tracking-[0.2px] text-white mt-2">
              A practical step toward cleaner mobility. CNG lowers cost and emissions while keeping rides comfortable and accessible for more people and more communities.
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

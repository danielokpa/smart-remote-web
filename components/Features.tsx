"use client";

import Image from "next/image";

export default function Features() {
  return (
    <section id="features" className="w-full bg-[#11021f] flex flex-col items-center py-12 relative overflow-hidden">
      {/* Mobile Layout */}
      <div className="md:hidden w-full flex flex-col items-center px-4 pt-12 pb-8">
        <div className="relative flex justify-center items-center w-full mb-8">
          <div
            className="absolute w-[300px] h-[300px] opacity-50 backdrop-blur-[40px]"
            style={{
              background:
                "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117, 31, 198, 0.65) 38.28%, rgba(78, 21, 131, 0) 100%)",
            }}
          />
          <Image
            src="/images/features/phone-solo1.png"
            alt="phone-solo1"
            width={220}
            height={330}
            className="relative z-10"
          />
        </div>

        <div className="w-full flex flex-col gap-6 text-left">
          <p className="font-manrope font-extrabold text-[#f7f9fc] text-[32px] leading-[130%] tracking-[-0.5px]">
            Move Freely with the<br />
            PEPP Cruise Ecosystem
          </p>

          <p className="font-manrope font-medium text-[15px] leading-relaxed tracking-[0.2px] text-[#8e94a4]">
            PEPP Cruise connects everyday movement across cities and states. From
            short rides to long routes, conversions to charging stops, everything
            works together in one easy app experience.
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block w-full max-w-[76rem] flex flex-col gap-6 text-left mt-0 md:text-left px-4 md:px-0">
        <p className="font-manrope font-extrabold text-[#f7f9fc] text-[32px] md:text-[clamp(2rem,4vw,4rem)] leading-[130%] tracking-[-0.5px]">
          Move Freely with the <br className="md:hidden" />
          PEPP Cruise Ecosystem
        </p>

        <p className="font-manrope font-medium text-[15px] md:text-base leading-relaxed tracking-[0.2px] text-[#8e94a4] max-w-3xl md:mx-0">
          PEPP Cruise connects everyday movement across cities and states. From
          short rides to long routes, conversions to charging stops, everything
          works together in one easy app experience.
        </p>

        {/* Mobile: Show only 3 main cards */}
        <div className="md:hidden w-full mt-8 px-4 flex flex-col gap-8">
          {[
            {
              title: "City Rides",
              text: "Request clean and reliable rides for everyday movement within your city. Smooth, affordable and convenient.",
              icon: "city",
            },
            {
              title: "Intra State Routes",
              text: "Move between towns and districts inside your state with reliable ride options that fit everyday schedules.",
              icon: "intra",
            },
            {
              title: "Inter State Travel",
              text: "Plan longer trips with comfortable EV and CNG vehicles. Travel between cities with safety and ease.",
              icon: "inter",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3 items-start">
              {item.icon === "city" && (
                <Image src="/images/features/city-logo.png" alt="city-logo" width={60} height={60} />
              )}
              {item.icon === "intra" && (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#00FFE7" strokeOpacity="0.2"/>
                  <path d="M37.332 24.5002H34.582V22.6668C34.582 21.6493 33.7662 20.8335 32.7487 20.8335H27.2487C26.2312 20.8335 25.4154 21.6493 25.4154 22.6668V24.5002H22.6654C21.6479 24.5002 20.832 25.316 20.832 26.3335V36.4168C20.832 37.4343 21.6479 38.2502 22.6654 38.2502H37.332C38.3495 38.2502 39.1654 37.4343 39.1654 36.4168V26.3335C39.1654 25.316 38.3495 24.5002 37.332 24.5002ZM27.2487 22.6668H32.7487V24.5002H27.2487V22.6668ZM37.332 36.4168H22.6654V34.5835H37.332V36.4168ZM37.332 31.8335H22.6654V26.3335H25.4154V28.1668H27.2487V26.3335H32.7487V28.1668H34.582V26.3335H37.332V31.8335Z" fill="#00FFE7"/>
                </svg>
              )}
              {item.icon === "inter" && (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#00FFE7" strokeOpacity="0.2"/>
                  <path d="M24.52 41.2498V39.9998H22.5V23.7498H27.38V19.7598H32.62V23.7498H37.5V39.9998H35.48V41.2498H34.23V39.9998H25.77V41.2498H24.52ZM28.63 23.7498H31.37V21.0098H28.63V23.7498ZM30 30.481C31.1042 30.481 32.1825 30.3402 33.235 30.0585C34.2875 29.7768 35.2925 29.3552 36.25 28.7935V24.9998H23.75V28.7935C24.7083 29.3552 25.7138 29.7768 26.7663 30.0585C27.8188 30.3402 28.8967 30.4818 30 30.481ZM29.375 32.9798V31.716C28.3883 31.6435 27.4258 31.4873 26.4875 31.2473C25.5492 31.0073 24.6367 30.6618 23.75 30.211V38.7498H36.25V30.2123C35.3625 30.6623 34.45 31.0073 33.5125 31.2473C32.575 31.4873 31.6125 31.6435 30.625 31.716V32.981L29.375 32.9798Z" fill="#00FFE7"/>
                </svg>
              )}
              <p className="font-manrope font-bold text-[24px] leading-[150%] text-white">{item.title}</p>
              <p className="text-[#8e94a4] font-manrope font-medium text-[14px] leading-[165%]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop: Show all cards */}
        {[
          [
            {
              title: "City Rides",
              text: "Request clean and reliable rides for everyday movement within your city. Smooth, affordable and convenient.",
              align: "end",
              icon: "city",
            },
            {
              title: "CNG Conversion Centers",
              text: "Locate the nearest certified center where you can convert your petrol vehicle to CNG for cleaner and more affordable driving.",
              align: "start",
              icon: "cng",
            },
          ],
          [
            {
              title: "Intra State Routes",
              text: "Move between towns and districts inside your state with reliable ride options that fit everyday schedules.",
              align: "end",
              icon: "intra",
            },
            {
              title: "EV Charging Stations",
              text: "Find charging points near you and get directions directly from the app. Charging becomes simple and planned.",
              align: "start",
              icon: "ev",
            },
          ],
          [
            {
              title: "Inter State Travel",
              text: "Plan longer trips with comfortable EV and CNG vehicles. Travel between cities with safety and ease.",
              align: "end",
              icon: "inter",
            },
            {
              title: "Register Your Car for CNG Conversion",
              text: "Use the app to book a conversion appointment at any of our certified centers. Choose your location, pick a date and get guided support from start to finish.",
              align: "start",
              icon: "register",
            },
          ],
        ].map((row, idx) => (
          <div
            key={idx}
            className="hidden md:flex w-full mt-12 max-w-[1216px] flex-col md:flex-row md:justify-between gap-10 md:gap-0 opacity-100 relative z-10"
          >
            {row.map((item, i) => (
              <div
                key={i}
                className={`relative md:w-[377px] flex flex-col gap-2 ${
                  item.align === "end" ? "items-end text-right" : "items-start text-left"
                }`}
              >
                {item.icon === "cng" && (
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#00FFE7" strokeOpacity="0.2"/>
                    <path d="M31.6231 30.6722L34.5846 27.25M32.1167 32.6278C32.1167 33.7078 31.2327 34.5833 30.1423 34.5833C29.0519 34.5833 28.168 33.7078 28.168 32.6278C28.168 31.5478 29.0519 30.6722 30.1423 30.6722C31.2327 30.6722 32.1167 31.5478 32.1167 32.6278Z" stroke="#00FFE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24.5 30C24.5 26.9624 26.9624 24.5 30 24.5C31.0018 24.5 31.941 24.7678 32.75 25.2358" stroke="#00FFE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M36.7096 21.292H23.293C22.1884 21.292 21.293 22.1874 21.293 23.292V36.7087C21.293 37.8132 22.1884 38.7087 23.293 38.7087H36.7096C37.8142 38.7087 38.7096 37.8132 38.7096 36.7087V23.292C38.7096 22.1874 37.8142 21.292 36.7096 21.292Z" stroke="#00FFE7" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                )}
                {item.icon === "ev" && (
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#00FFE7" strokeOpacity="0.2"/>
                    <path d="M33.6667 39.1668V26.3335C33.6667 23.7412 33.6667 22.4441 32.8609 21.6392C32.0561 20.8335 30.759 20.8335 28.1667 20.8335H27.25C24.6577 20.8335 23.3606 20.8335 22.5557 21.6392C21.75 22.4441 21.75 23.7412 21.75 26.3335V39.1668" stroke="#00FFE7" strokeWidth="1.5"/>
                    <path d="M27.707 28.167L26.332 30.4587H29.082L27.707 32.7503" stroke="#00FFE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M34.582 39.167H20.832M36.8737 22.667L38.0039 23.5708C38.1304 23.6717 38.1937 23.723 38.2514 23.7743C38.7932 24.2604 39.1202 24.9414 39.1608 25.6682C39.1654 25.7452 39.1654 25.8258 39.1654 25.9872V35.9587C39.1654 36.3233 39.0205 36.6731 38.7626 36.9309C38.5048 37.1888 38.155 37.3337 37.7904 37.3337C37.4257 37.3337 37.076 37.1888 36.8181 36.9309C36.5602 36.6731 36.4154 36.3233 36.4154 35.9587V35.8936C36.4154 35.1694 35.8287 34.5837 35.1054 34.5837H33.6654" stroke="#00FFE7" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M39.1641 26.3335H37.7891C37.4244 26.3335 37.0747 26.4784 36.8168 26.7362C36.5589 26.9941 36.4141 27.3438 36.4141 27.7085V29.9259C36.4141 30.2145 36.5049 30.4958 36.6737 30.7299C36.8425 30.9641 37.0807 31.1391 37.3546 31.2303L39.1641 31.8335" stroke="#00FFE7" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
                {item.icon === "register" && (
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#00FFE7" strokeOpacity="0.2"/>
                    <path d="M26.332 34.5835H33.6654" stroke="#00FFE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M26.332 30.9165H29.9987" stroke="#00FFE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M30.918 21.2918V21.7502C30.918 24.3429 30.918 25.6392 31.7234 26.4447C32.5289 27.2502 33.8252 27.2502 36.418 27.2502H36.8763M37.3346 28.7689V31.8335C37.3346 35.2905 37.3346 37.0189 36.2607 38.0929C35.1868 39.1668 33.4583 39.1668 30.0013 39.1668C26.5443 39.1668 24.8159 39.1668 23.7419 38.0929C22.668 37.0189 22.668 35.2905 22.668 31.8335V27.668C22.668 24.6934 22.668 23.2061 23.4802 22.1987C23.6443 21.9952 23.8297 21.8098 24.0332 21.6457C25.0406 20.8335 26.5279 20.8335 29.5025 20.8335C30.1492 20.8335 30.4726 20.8335 30.7687 20.938C30.8303 20.9597 30.8907 20.9848 30.9496 21.0129C31.2329 21.1484 31.4615 21.3771 31.9189 21.8344L36.2607 26.1762C36.7906 26.7061 37.0555 26.9711 37.1951 27.308C37.3346 27.6449 37.3346 28.0196 37.3346 28.7689Z" stroke="#00FFE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {item.icon === "inter" && (
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#00FFE7" strokeOpacity="0.2"/>
                    <path d="M24.52 41.2498V39.9998H22.5V23.7498H27.38V19.7598H32.62V23.7498H37.5V39.9998H35.48V41.2498H34.23V39.9998H25.77V41.2498H24.52ZM28.63 23.7498H31.37V21.0098H28.63V23.7498ZM30 30.481C31.1042 30.481 32.1825 30.3402 33.235 30.0585C34.2875 29.7768 35.2925 29.3552 36.25 28.7935V24.9998H23.75V28.7935C24.7083 29.3552 25.7138 29.7768 26.7663 30.0585C27.8188 30.3402 28.8967 30.4818 30 30.481ZM29.375 32.9798V31.716C28.3883 31.6435 27.4258 31.4873 26.4875 31.2473C25.5492 31.0073 24.6367 30.6618 23.75 30.211V38.7498H36.25V30.2123C35.3625 30.6623 34.45 31.0073 33.5125 31.2473C32.575 31.4873 31.6125 31.6435 30.625 31.716V32.981L29.375 32.9798Z" fill="#00FFE7"/>
                  </svg>
                )}
                {item.icon === "intra" && (
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#00FFE7" strokeOpacity="0.2"/>
                    <path d="M37.332 24.5002H34.582V22.6668C34.582 21.6493 33.7662 20.8335 32.7487 20.8335H27.2487C26.2312 20.8335 25.4154 21.6493 25.4154 22.6668V24.5002H22.6654C21.6479 24.5002 20.832 25.316 20.832 26.3335V36.4168C20.832 37.4343 21.6479 38.2502 22.6654 38.2502H37.332C38.3495 38.2502 39.1654 37.4343 39.1654 36.4168V26.3335C39.1654 25.316 38.3495 24.5002 37.332 24.5002ZM27.2487 22.6668H32.7487V24.5002H27.2487V22.6668ZM37.332 36.4168H22.6654V34.5835H37.332V36.4168ZM37.332 31.8335H22.6654V26.3335H25.4154V28.1668H27.2487V26.3335H32.7487V28.1668H34.582V26.3335H37.332V31.8335Z" fill="#00FFE7"/>
                  </svg>
                )}
                {item.icon === "city" && (
                  <Image src="/images/features/city-logo.png" alt="city-logo" width={60} height={60} />
                )}
                <p className="font-manrope font-bold text-[24px] leading-[150%]">{item.title}</p>
                <p className="text-[rgba(142,148,164,1)] font-manrope font-medium text-[14px] leading-[165%]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="hidden md:flex absolute top-[284px] h-[718px] inset-0 items-center justify-center z-0 pointer-events-none">
        <div
          className="opacity-[0.5] w-[718px] h-[718px] backdrop-blur-[50px]"
          style={{
            background:
              "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117,31,198,0.656447) 38.28%, rgba(78,21,131,0) 100%)",
          }}
        />
        <Image
          src="/images/features/phone-solo1.png"
          alt="phone-solo1"
          width={368}
          height={553.85}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Mobile Wallet Section */}
      <div className="md:hidden w-full flex flex-col items-center py-12 px-4 bg-[#11021f]">
        <div className="relative w-full mb-8">
          <Image
            src="/images/features/wallet-mock.png"
            alt="wallet-mock"
            width={400}
            height={250}
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
        <div className="w-full flex flex-col gap-4 text-left">
          <p className="font-manrope font-bold text-[32px] leading-[140%] tracking-[0.2px] text-white">
            Your Wallet.<br />Your Movement.
          </p>
          <p className="font-manrope font-semibold text-[16px] leading-[150%] text-white">
            A simple place to pay, earn and enjoy more with PEPP Cruise.
          </p>
          <p className="font-manrope font-normal text-[13px] leading-[150%] text-[#c1c4cd]">
            You can add money, pay for rides and manage your daily movement without stress. Every time you use the app, you earn PEPP Coins as rewards.
            These coins grow as you ride, refer friends or explore new features. Your PEPP Coins are real value, not just points. You can use them to
            pay for rides, buy airtime and enjoy added benefits inside the app. If you prefer Pi, the wallet also supports Pi payment for topping up or paying directly.
            And when you need airtime or data, you can buy it right here without switching apps. The wallet is built to feel friendly, rewarding and easy, so every journey gives you something back.
          </p>
          <button className="mt-4 flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-[#762FB8] to-[#9B4DE0] hover:from-[#8A3AC7] hover:to-[#AB5DF0] transition-all cursor-pointer select-none shadow-lg w-full justify-center">
            <span className="font-manrope font-semibold text-white text-base">
              Get Started
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="hidden md:flex w-full justify-center py-16 px-4 md:px-0">
        <div className="relative w-full max-w-[1225px] rounded-[16px] border border-[rgba(0,255,231,0.3)] bg-[rgba(155,160,175,0.2)] backdrop-blur-[4px] overflow-hidden flex flex-col md:flex-row items-start gap-6 p-6 md:p-12">

          <div
            className="absolute z-0 opacity-50 rounded-full overflow-hidden backdrop-blur-[70px] hidden md:block"
            style={{
              width: "674px",
              height: "674px",
              top: "-283px",
              left: "280.5px",
              background:
                "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117, 31, 198, 0.656447) 18.28%, #2d223c 50%)",
            }}
          ></div>

          <div className="relative w-full md:w-1/2 h-auto flex-shrink-0 z-20">
            {/* PEPP Cruise Logo at top left */}
            <div className="absolute top-0 left-0 z-30">
              <Image
                src="/images/pepp_cruise_p_logo.webp"
                alt="PEPP Cruise Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            
            <div className="relative w-full">
              {/* Image */}
              <Image
                src="/images/features/wallet-mock.png"
                alt="wallet-mock"
                width={646}
                height={407}
                className="w-full h-auto object-contain rounded-lg"
              />

              {/* Buttons overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex items-end justify-between gap-4 px-2">
                {/* Get Started Button */}
                <button className="flex items-center  gap-3 px-4 py-4 rounded-[100px] bg-gradient-to-r from-[#762FB8] to-[#9B4DE0] hover:from-[#8A3AC7] hover:to-[#AB5DF0] transition-all cursor-pointer select-none shadow-lg">
                  <span className="font-manrope font-semibold text-white text-base">
                    Get Started
                  </span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Download Buttons */}
                <div className="flex gap-3">
                  {/* Play Store Button */}
                  <button className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/20 bg-[#762FB8]/20 hover:bg-[#762FB8]/30 transition-colors cursor-pointer select-none">
                    <svg width="22" height="22" viewBox="0 0 43 43" fill="none">
                      <circle cx="21.0337" cy="21.0337" r="21.0337" fill="white"/>
                      <g clipPath="url(#clip0_wallet_playstore)">
                        <path d="M23.1625 19.9638L15.2805 12.0607L25.3087 17.8176L23.1625 19.9638ZM13.224 11.5962C12.7595 11.839 12.4492 12.2819 12.4492 12.8567V28.6166C12.4492 29.1914 12.7601 29.6343 13.224 29.8771L22.3882 20.7346L13.224 11.5962ZM28.4085 19.653L26.3052 18.4353L23.959 20.7386L26.3052 23.042L28.4514 21.8243C29.0942 21.314 29.0942 20.1638 28.4085 19.653ZM15.2811 29.4171L25.3092 23.6602L23.163 21.514L15.2811 29.4171Z" fill="#762FB8"/>
                      </g>
                    </svg>
                    <span className="font-manrope font-semibold text-white text-[10px]">Play Store</span>
                  </button>


                  {/* App Store Button */}
                  <button className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/20 bg-white hover:bg-white/90 transition-colors cursor-pointer select-none">
                    <svg width="22" height="22" viewBox="0 0 43 43" fill="none">
                      <circle cx="21.0337" cy="21.0337" r="21.0337" fill="#762FB8"/>
                      <g clipPath="url(#clip0_wallet_appstore)">
                        <path d="M20.6422 16.0047C20.4476 14.9437 20.9493 13.8518 21.5535 13.1159C22.2193 12.304 23.362 11.6813 24.3385 11.6129C24.5035 12.7253 24.0495 13.8092 23.4519 14.5758C22.8109 15.3994 21.7087 16.0381 20.6422 16.0047ZM26.3702 19.8494C26.6723 19.0063 27.271 18.2478 28.1996 17.7361C27.2612 16.565 25.9435 15.8851 24.7001 15.8851C23.055 15.8851 22.3595 16.6689 21.2168 16.6689C20.0397 16.6689 19.1467 15.8851 17.7217 15.8851C16.3244 15.8851 14.837 16.7368 13.8937 18.1913C13.5468 18.729 13.3119 19.3969 13.1838 20.1409C12.8282 22.2279 13.3593 24.9463 14.9436 27.36C15.714 28.5312 16.7407 29.8505 18.0821 29.862C19.277 29.8736 19.616 29.098 21.2336 29.09C22.8536 29.0808 23.1606 29.87 24.3539 29.8586C25.6957 29.8473 26.779 28.3873 27.5493 27.2162C28.0978 26.3758 28.3053 25.9513 28.7318 25.0012C26.5631 24.1833 25.6711 21.7936 26.3702 19.8494Z" fill="white"/>
                      </g>
                    </svg>
                    <span className="font-manrope font-semibold text-black text-[10px]">App Store</span>
                  </button>


                </div>
              </div>
            </div>

          </div>

          <div className="w-full md:w-1/2 py-0 flex flex-col gap-2 z-6 ">
            <p className="w-[376px] h-[112px] text-[#f7f9fc] font-manrope font-bold text-[40px] leading-[140%] tracking-[0.2px] opacity-100">
            Your Wallet. Your Movement.
          </p>


            <p className="font-manrope text-gray-100 text-[#e8eaed] mb-0 w-[360px] font-semibold text-base md:text-[18px] leading-[150%]">
              A simple place to pay, earn and enjoy more with PEPP Cruise.
            </p>
            <p className="w-[498px] text-[13px] text-[#c1c4cd] font-normal tracking-[0.3px] font-manrope
                          max-sm:w-full max-sm:text-[11px] max-sm:leading-[150%]">
              You can add money, pay for rides and manage your daily movement without stress. Every time you use the app, you earn PEPP Coins as rewards.
              These coins grow as you ride, refer friends or explore new features. Your PEPP Coins are real value, not just points. You can use them to
              pay for rides, buy airtime and enjoy added benefits inside the app. If you prefer Pi, the wallet also supports Pi payment for topping up or paying directly.
              And when you need airtime or data, you can buy it right here without switching apps. The wallet is built to feel friendly, rewarding and easy, so every journey gives you something back.
            </p>


          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mt-8">
        <button className="relative w-36 h-9 rounded-full bg-transparent text-white text-sm font-inter font-regular text-center overflow-hidden ring-1 ring-white/15 shadow-none transition-all duration-500 hover:ring-2 hover:ring-[#00FFE7]/40 hover:shadow-[0_0_10px_rgba(0,255,231,0.5)]">
          Safety
          <span
            className="absolute bottom-0 left-0 w-full h-px rounded-full animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,255,231,0) 0%, rgba(0,255,231,0.9) 50%, rgba(0,255,231,0) 100%)",
            }}
          ></span>
        </button>
      </div>

      <div className="w-full flex justify-center py-12 px-4 md:px-0">
        <div className="w-full max-w-[1058px] flex flex-col md:flex-row relative">
          {[
            {
              title: "Verified drivers",
              text: "Every driver goes through checks, real checks. Not the my cousin said he's cool kind. We review identity, driving history and conduct to ensure you're riding with someone who knows the road and respects it.",
              icon: "/images/features/verify-tick.png",
            },
            {
              title: "Routine inspections",
              text: "Vehicles aren't just left to vibes. They get inspected regularly so everything stays smooth, steady and road-ready.",
              icon: "/images/features/routine-check.png",
            },
            {
              title: "Live ride tracking",
              text: "You can see your ride in real time from start to finish. Share it with someone if you want. It's transparency, not suspense.",
              icon: "/images/features/live-tracking.png",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center text-center gap-4 px-6 md:px-8 py-8 relative">
              {/* Vertical separator line between sections - not full height */}
              {idx > 0 && (
                <div 
                  className="hidden md:block absolute left-0 top-[10%] bottom-[10%] w-px"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 255, 231, 0.3) 10%, rgba(0, 255, 231, 0.5) 50%, rgba(0, 255, 231, 0.3) 90%, transparent 100%)',
                    boxShadow: '0 0 8px rgba(0, 255, 231, 0.4)',
                  }}
                />
              )}
              <div className="flex justify-center mb-4">
                <Image src={item.icon} alt={item.title} width={60} height={60} className="object-contain" />
              </div>
              <p className="font-manrope font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-[140%] mb-4">
                {item.title}
              </p>
              <p className="font-manrope font-medium text-white text-sm md:text-base leading-[165%] max-w-md">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Become a Driver Section */}
      <div id="become-driver" className="w-full flex justify-center py-12 md:py-16 px-4 md:px-0 mt-12 md:mt-16 bg-[#11021f]">
        {/* Mobile Layout */}
        <div className="md:hidden w-full flex flex-col">
          <div className="relative w-full rounded-2xl overflow-hidden mb-6">
            <Image
              src="/images/become-driver/become_a_driver.png"
              alt="Become a Driver"
              width={760}
              height={400}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
          <div className="w-full flex flex-col gap-4 px-4">
            <h3 className="font-manrope font-bold text-white text-[32px] leading-[140%]">
              Become a Pepp Cruise Driver
            </h3>
            <p className="font-manrope font-bold text-white text-[20px] leading-[140%]">
              Earn on your schedule. Drive with confidence.
            </p>
            <p className="font-manrope font-normal text-white text-[15px] leading-[165%]">
              Pepp Cruise gives skilled, respectful drivers an opportunity to earn steady income while offering passengers a smooth, secure way to move around the city. Whether you drive an EV or a CNG powered vehicle, there is a seat for you in the ecosystem. You choose when to go online, how long you want to drive, and how fast you want your earnings to grow.
            </p>
            <a href="become-driver" className="font-manrope text-[#00FFE7] cursor-pointer text-[15px] mt-2">
              More Info
            </a>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex relative w-full max-w-[1225px] rounded-[16px] border border-[rgba(0,255,231,0.3)] bg-[#9BA0AF33] overflow-hidden flex-col md:flex-row">
          {/* Left Panel - Text Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 p-8 md:p-12">
            <h3 className="font-manrope font-bold text-white text-2xl md:text-4xl lg:text-4xl leading-[140%]">
              Become a Pepp <br/>Cruise Driver
            </h3>
            <p className="font-manrope font-bold text-white text-xl md:text-1xl leading-[140%]">
              Earn on your schedule. Drive with confidence.
            </p>
            <p className="font-manrope font-normal text-white text-sm md:text-base leading-[165%]">
              Pepp Cruise gives skilled, respectful drivers an opportunity to earn steady income while offering passengers a smooth, secure way to move around the city. Whether you drive an EV or a CNG powered vehicle, there is a seat for you in the ecosystem. You choose when to go online, how long you want to drive, and how fast you want your earnings to grow.
            </p>
            <a href="become-driver" className="font-manrope text-[#00FFE7] cursor-pointer">
              More Info
            </a>
          </div>

          {/* Right Panel - Image with Logo and Buttons */}
          <div className="relative w-full md:w-1/2 h-auto p-10">
            <div className="relative h-[400px] p-10 pl-15 w-full rounded-[30px] overflow-hidden" style={{ backgroundImage: "url('/images/become-driver/become_a_driver.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
              {/* PEPP Cruise Logo at top left */}
              <div className=" top-4 left-4 z-30">
                <svg width="102" height="17" viewBox="0 0 102 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_driver_logo)">
                    <path d="M12.0134 3.25146H1.98663C0.889446 3.25146 0 4.12879 0 5.21102V14.2919C0 15.3741 0.889446 16.2515 1.98663 16.2515H12.0134C13.1106 16.2515 14 15.3741 14 14.2919V5.21102C14 4.12879 13.1106 3.25146 12.0134 3.25146Z" fill="white"/>
                    <path d="M11.2759 9.26983C11.1807 9.5088 11.0437 9.72964 10.8716 9.91588C10.2651 10.5735 9.52488 10.8915 8.61761 10.8833C6.89497 10.8668 5.17066 10.8784 3.44801 10.8784C3.35779 10.8784 3.26589 10.8685 3.11719 10.8619C3.27425 10.524 3.37784 10.2191 3.54827 9.95543C3.81894 9.53023 4.21326 9.26818 4.74793 9.26983C5.15395 9.26983 5.56163 9.26983 5.97934 9.26983C6.00942 8.53809 6.61593 8.3535 7.03365 8.34197C7.4547 8.32878 7.91418 8.51337 8.06122 8.9155C8.09964 9.02097 8.11802 9.26654 8.11802 9.26654C8.11802 9.26654 8.23665 9.27478 8.34025 9.27148C8.509 9.26654 8.67776 9.26654 8.84651 9.26654V9.26983H11.2776H11.2759Z" fill="#270653"/>
                    <path d="M11.3612 9.02522H9.58512C9.62355 8.70385 9.63358 8.38082 9.53333 8.06439C9.40467 7.65567 9.09222 7.4579 8.6812 7.42329C8.34368 7.39692 8.00283 7.40517 7.66365 7.41011C7.41637 7.41341 7.19749 7.34913 6.99866 7.20245C6.52915 6.858 6.0563 6.5185 5.58679 6.17405C5.54335 6.14274 5.51328 6.09165 5.45312 6.02243C5.5517 6.01254 5.6152 5.99936 5.67869 5.99936C6.72297 5.99936 7.76724 5.97299 8.80985 6.0076C9.91595 6.0455 10.7497 6.56135 11.2443 7.5502C11.4682 7.99682 11.4949 8.5341 11.3596 9.02522H11.3612Z" fill="#270653"/>
                    <path d="M4.52772 13.4647H2.14844C2.43749 12.6555 2.69647 11.8776 3.00558 11.1211H5.3598C5.0791 11.9352 4.82179 12.7131 4.52772 13.4647Z" fill="#270653"/>
                  </g>
                  <path d="M21.34 14V5.36H24.91C24.994 5.36 25.102 5.364 25.234 5.372C25.366 5.376 25.488 5.388 25.6 5.408C26.1 5.484 26.512 5.65 26.836 5.906C27.164 6.162 27.406 6.486 27.562 6.878C27.722 7.266 27.802 7.698 27.802 8.174C27.802 8.646 27.722 9.078 27.562 9.47C27.402 9.858 27.158 10.18 26.83 10.436C26.506 10.692 26.096 10.858 25.6 10.934C25.488 10.95 25.364 10.962 25.228 10.97C25.096 10.978 24.99 10.982 24.91 10.982H22.786V14H21.34ZM22.786 9.632H24.85C24.93 9.632 25.02 9.628 25.12 9.62C25.22 9.612 25.312 9.596 25.396 9.572C25.636 9.512 25.824 9.406 25.96 9.254C26.1 9.102 26.198 8.93 26.254 8.738C26.314 8.546 26.344 8.358 26.344 8.174C26.344 7.99 26.314 7.802 26.254 7.61C26.198 7.414 26.1 7.24 25.96 7.088C25.824 6.936 25.636 6.83 25.396 6.77C25.312 6.746 25.22 6.732 25.12 6.728C25.02 6.72 24.93 6.716 24.85 6.716H22.786V9.632ZM29.0041 14V5.36H34.5841V6.716H30.4501V8.846H33.8641V10.202H30.4501V12.644H34.5841V14H29.0041ZM36.0236 14V5.36H39.5936C39.6776 5.36 39.7856 5.364 39.9176 5.372C40.0496 5.376 40.1716 5.388 40.2836 5.408C40.7836 5.484 41.1956 5.65 41.5196 5.906C41.8476 6.162 42.0896 6.486 42.2456 6.878C42.4056 7.266 42.4856 7.698 42.4856 8.174C42.4856 8.646 42.4056 9.078 42.2456 9.47C42.0856 9.858 41.8416 10.18 41.5136 10.436C41.1896 10.692 40.7796 10.858 40.2836 10.934C40.1716 10.95 40.0476 10.962 39.9116 10.97C39.7796 10.978 39.6736 10.982 39.5936 10.982H37.4696V14H36.0236ZM37.4696 9.632H39.5336C39.6136 9.632 39.7036 9.628 39.8036 9.62C39.9036 9.612 39.9956 9.596 40.0796 9.572C40.3196 9.512 40.5076 9.406 40.6436 9.254C40.7836 9.102 40.8816 8.93 40.9376 8.738C40.9976 8.546 41.0276 8.358 41.0276 8.174C41.0276 7.99 40.9976 7.802 40.9376 7.61C40.8816 7.414 40.7836 7.24 40.6436 7.088C40.5076 6.936 40.3196 6.83 40.0796 6.77C39.9956 6.746 39.9036 6.732 39.8036 6.728C39.7036 6.72 39.6136 6.716 39.5336 6.716H37.4696V9.632ZM43.6877 14V5.36H47.2577C47.3417 5.36 47.4497 5.364 47.5817 5.372C47.7137 5.376 47.8357 5.388 47.9477 5.408C48.4477 5.484 48.8597 5.65 49.1837 5.906C49.5117 6.162 49.7537 6.486 49.9097 6.878C50.0697 7.266 50.1497 7.698 50.1497 8.174C50.1497 8.646 50.0697 9.078 49.9097 9.47C49.7497 9.858 49.5057 10.18 49.1777 10.436C48.8537 10.692 48.4437 10.858 47.9477 10.934C47.8357 10.95 47.7117 10.962 47.5757 10.97C47.4437 10.978 47.3377 10.982 47.2577 10.982H45.1337V14H43.6877ZM45.1337 9.632H47.1977C47.2777 9.632 47.3677 9.628 47.4677 9.62C47.5677 9.612 47.6597 9.596 47.7437 9.572C47.9837 9.512 48.1717 9.406 48.3077 9.254C48.4477 9.102 48.5457 8.93 48.6017 8.738C48.6617 8.546 48.6917 8.358 48.6917 8.174C48.6917 7.99 48.6617 7.802 48.6017 7.61C48.5457 7.414 48.4477 7.24 48.3077 7.088C48.1717 6.936 47.9837 6.83 47.7437 6.77C47.6597 6.746 47.5677 6.732 47.4677 6.728C47.3677 6.72 47.2777 6.716 47.1977 6.716H45.1337V9.632ZM57.4081 14.18C56.5441 14.18 55.8041 13.992 55.1881 13.616C54.5721 13.236 54.0981 12.708 53.7661 12.032C53.4381 11.356 53.2741 10.572 53.2741 9.68C53.2741 8.788 53.4381 8.004 53.7661 7.328C54.0981 6.652 54.5721 6.126 55.1881 5.75C55.8041 5.37 56.5441 5.18 57.4081 5.18C58.4041 5.18 59.2341 5.43 59.8981 5.93C60.5621 6.426 61.0281 7.096 61.2961 7.94L59.8381 8.342C59.6701 7.778 59.3841 7.338 58.9801 7.022C58.5761 6.702 58.0521 6.542 57.4081 6.542C56.8281 6.542 56.3441 6.672 55.9561 6.932C55.5721 7.192 55.2821 7.558 55.0861 8.03C54.8941 8.498 54.7961 9.048 54.7921 9.68C54.7921 10.312 54.8881 10.864 55.0801 11.336C55.2761 11.804 55.5681 12.168 55.9561 12.428C56.3441 12.688 56.8281 12.818 57.4081 12.818C58.0521 12.818 58.5761 12.658 58.9801 12.338C59.3841 12.018 59.6701 11.578 59.8381 11.018L61.2961 11.42C61.0281 12.264 60.5621 12.936 59.8981 13.436C59.2341 13.932 58.4041 14.18 57.4081 14.18ZM62.6134 14V7.52H63.8914V9.098L63.7354 8.894C63.8154 8.678 63.9214 8.482 64.0534 8.306C64.1894 8.126 64.3514 7.978 64.5394 7.862C64.6994 7.754 64.8754 7.67 65.0674 7.61C65.2635 7.546 65.4635 7.508 65.6675 7.496C65.8715 7.48 66.0695 7.488 66.2615 7.52V8.87C66.0695 8.814 65.8475 8.796 65.5955 8.816C65.3475 8.836 65.1235 8.906 64.9234 9.026C64.7234 9.134 64.5594 9.272 64.4314 9.44C64.3074 9.608 64.2154 9.8 64.1554 10.016C64.0954 10.228 64.0654 10.458 64.0654 10.706V14H62.6134ZM69.8364 14.186C69.3564 14.186 68.9604 14.106 68.6484 13.946C68.3364 13.786 68.0884 13.582 67.9044 13.334C67.7204 13.086 67.5844 12.822 67.4964 12.542C67.4084 12.262 67.3504 11.998 67.3224 11.75C67.2984 11.498 67.2864 11.294 67.2864 11.138V7.52H68.7504V10.64C68.7504 10.84 68.7644 11.066 68.7924 11.318C68.8204 11.566 68.8844 11.806 68.9844 12.038C69.0884 12.266 69.2404 12.454 69.4404 12.602C69.6444 12.75 69.9184 12.824 70.2624 12.824C70.4464 12.824 70.6284 12.794 70.8084 12.734C70.9884 12.674 71.1504 12.572 71.2944 12.428C71.4424 12.28 71.5604 12.078 71.6484 11.822C71.7364 11.566 71.7804 11.242 71.7804 10.85L72.6384 11.216C72.6384 11.768 72.5304 12.268 72.3144 12.716C72.1024 13.164 71.7884 13.522 71.3724 13.79C70.9564 14.054 70.4444 14.186 69.8364 14.186ZM71.9544 14V11.99H71.7804V7.52H73.2324V14H71.9544ZM75.0381 6.536V5.21H76.4841V6.536H75.0381ZM75.0381 14V7.52H76.4841V14H75.0381ZM80.7834 14.18C79.9834 14.18 79.3334 14 78.8334 13.64C78.3334 13.28 78.0294 12.774 77.9214 12.122L79.3974 11.894C79.4734 12.214 79.6414 12.466 79.9014 12.65C80.1614 12.834 80.4894 12.926 80.8854 12.926C81.2334 12.926 81.5014 12.858 81.6894 12.722C81.8814 12.582 81.9774 12.392 81.9774 12.152C81.9774 12.004 81.9414 11.886 81.8694 11.798C81.8014 11.706 81.6494 11.618 81.4134 11.534C81.1774 11.45 80.8154 11.344 80.3274 11.216C79.7834 11.072 79.3514 10.918 79.0314 10.754C78.7114 10.586 78.4814 10.388 78.3414 10.16C78.2014 9.932 78.1314 9.656 78.1314 9.332C78.1314 8.928 78.2374 8.576 78.4494 8.276C78.6614 7.976 78.9574 7.746 79.3374 7.586C79.7174 7.422 80.1654 7.34 80.6814 7.34C81.1854 7.34 81.6314 7.418 82.0194 7.574C82.4114 7.73 82.7274 7.952 82.9674 8.24C83.2074 8.528 83.3554 8.866 83.4114 9.254L81.9354 9.518C81.8994 9.242 81.7734 9.024 81.5574 8.864C81.3454 8.704 81.0614 8.614 80.7054 8.594C80.3654 8.574 80.0914 8.626 79.8834 8.75C79.6754 8.87 79.5714 9.04 79.5714 9.26C79.5714 9.384 79.6134 9.49 79.6974 9.578C79.7814 9.666 79.9494 9.754 80.2014 9.842C80.4574 9.93 80.8374 10.038 81.3414 10.166C81.8574 10.298 82.2694 10.45 82.5774 10.622C82.8894 10.79 83.1134 10.992 83.2494 11.228C83.3894 11.464 83.4594 11.75 83.4594 12.086C83.4594 12.738 83.2214 13.25 82.7454 13.622C82.2734 13.994 81.6194 14.18 80.7834 14.18ZM87.7196 14.18C87.0636 14.18 86.4876 14.038 85.9916 13.754C85.4956 13.47 85.1076 13.076 84.8276 12.572C84.5516 12.068 84.4136 11.488 84.4136 10.832C84.4136 10.124 84.5496 9.51 84.8216 8.99C85.0936 8.466 85.4716 8.06 85.9556 7.772C86.4396 7.484 86.9996 7.34 87.6356 7.34C88.3076 7.34 88.8776 7.498 89.3456 7.814C89.8176 8.126 90.1676 8.568 90.3956 9.14C90.6236 9.712 90.7096 10.386 90.6536 11.162H89.2196V10.634C89.2156 9.93 89.0916 9.416 88.8476 9.092C88.6036 8.768 88.2196 8.606 87.6956 8.606C87.1036 8.606 86.6636 8.79 86.3756 9.158C86.0876 9.522 85.9436 10.056 85.9436 10.76C85.9436 11.416 86.0876 11.924 86.3756 12.284C86.6636 12.644 87.0836 12.824 87.6356 12.824C87.9916 12.824 88.2976 12.746 88.5536 12.59C88.8136 12.43 89.0136 12.2 89.1536 11.9L90.5816 12.332C90.3336 12.916 89.9496 13.37 89.4296 13.694C88.9136 14.018 88.3436 14.18 87.7196 14.18ZM85.4876 11.162V10.07H89.9456V11.162H85.4876Z" fill="white"/>
                  <defs>
                    <clipPath id="clip0_driver_logo">
                      <rect width="14" height="13" fill="white" transform="translate(0 3.25049)"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>

              {/* Download Buttons - Bottom Right */}
              <div className="absolute bottom-4 right-4 z-30 flex gap-3">
                {/* Play Store Button */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm hover:transition-colors cursor-pointer select-none">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10.7079" cy="10.7079" r="10.7079" fill="white"/>
                    <g clip-path="url(#clip0_9803_1436)">
                    <path d="M11.7938 10.1627L7.78121 6.13933L12.8864 9.07006L11.7938 10.1627ZM6.73429 5.90283C6.4978 6.02646 6.33984 6.2519 6.33984 6.54454V14.5676C6.33984 14.8603 6.49809 15.0857 6.73429 15.2093L11.3996 10.5551L6.73429 5.90283ZM14.4645 10.0044L13.3937 9.38452L12.1993 10.5571L13.3937 11.7297L14.4863 11.1098C14.8135 10.85 14.8135 10.2645 14.4645 10.0044ZM7.7815 14.9752L12.8867 12.0444L11.7941 10.9518L7.7815 14.9752Z" fill="#762FB8"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_9803_1436">
                    <rect width="9.30855" height="9.30855" fill="white" transform="translate(5.87891 5.90186)"/>
                    </clipPath>
                    </defs>
                  </svg>

                  <span className="font-manrope font-semibold text-white text-sm">Play Store</span>
                </button>

                {/* App Store Button */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20  transition-colors cursor-pointer select-none">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10.7079" cy="10.7079" r="10.7079" fill="white"/>
                    <g clip-path="url(#clip0_9803_1442)">
                    <path d="M10.3976 8.14742C10.2985 7.60727 10.5539 7.05139 10.8615 6.67678C11.2005 6.26344 11.7822 5.94646 12.2794 5.91162C12.3633 6.47793 12.1322 7.0297 11.828 7.41999C11.5017 7.83927 10.9406 8.16442 10.3976 8.14742ZM13.3136 10.1047C13.4675 9.67549 13.7722 9.28935 14.245 9.02882C13.7672 8.43264 13.0964 8.08651 12.4635 8.08651C11.626 8.08651 11.2718 8.48552 10.6901 8.48552C10.0909 8.48552 9.63629 8.08651 8.91086 8.08651C8.1995 8.08651 7.44229 8.52009 6.96206 9.26057C6.78549 9.53428 6.66588 9.87432 6.60065 10.2531C6.41964 11.3155 6.69002 12.6994 7.49658 13.9282C7.88874 14.5244 8.41145 15.1961 9.09432 15.2019C9.70263 15.2079 9.8752 14.813 10.6987 14.8089C11.5234 14.8042 11.6797 15.206 12.2872 15.2002C12.9703 15.1944 13.5218 14.4512 13.9139 13.855C14.1932 13.4272 14.2988 13.2111 14.5159 12.7274C13.4118 12.311 12.9577 11.0944 13.3136 10.1047Z" fill="#762FB8"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_9803_1442">
                    <rect width="9.30855" height="9.30855" fill="white" transform="translate(5.87891 5.90088)"/>
                    </clipPath>
                    </defs>
                  </svg>

                  <span className="font-manrope font-semibold text-white text-sm">App Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

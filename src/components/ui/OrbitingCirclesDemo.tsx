import Image from "next/image";
import OrbitingCircles from "./orbiting-circles";

export function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
        Tuunels
      </span>

      {/* Inner Circles */}
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <Image height={40} width={40} src={"/images/android.webp"} alt="" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
        <Image height={40} width={40} src={"/images/chrome.webp"} alt="" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={15}
        radius={160}
      >
        <Image height={40} width={40} src={"/images/firefox.webp"} alt="" />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={320}
        reverse
      >
        <Image height={40} width={40} src={"/images/edge.webp"} alt="" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={120}
        duration={20}
        delay={20}
        reverse
      >
        <Image height={40} width={40} src={"/images/ios.webp"} alt="" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={220}
        duration={20}
        delay={15}
        reverse
      >
        <Image height={40} width={40} src={"/images/windows.webp"} alt="" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={250}
        duration={20}
        delay={25}
        reverse
      >
        <Image height={40} width={40} src={"/images/linux.webp"} alt="" />
      </OrbitingCircles>
    </div>
  );
}

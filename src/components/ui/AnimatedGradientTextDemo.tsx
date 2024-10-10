"use client";

import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedGradientText from "./animated-gradient-text";

export function AnimatedGradientTextDemo() {
  return (
    <div className="z-10 flex min-h-64 items-center justify-center">
      <AnimatedGradientText>
        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
          )}
        >
          وضعیت سرور:
          <strong className="mr-1">آنلاین</strong>
        </span>
        <ChevronLeft className="mr-1 size-3 transition-transform duration-300 ease-in-out group-hover:-translate-x-0.5" />
      </AnimatedGradientText>
    </div>
  );
}

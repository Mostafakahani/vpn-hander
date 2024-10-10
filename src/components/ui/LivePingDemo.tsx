import React, { useState, useEffect } from "react";
import ShinyButton from "./shiny-button";

const getRandomPing = (): number => {
  return Math.floor(Math.random() * (900 - 350 + 1)) + 350;
};

const getPingColor = (ping: number): string => {
  if (ping < 500) return "text-green-500";
  if (ping < 700) return "text-yellow-500";
  return "text-red-500";
};

export function LivePingDemo() {
  const [ping, setPing] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isChecking) {
      setPing(getRandomPing());
      interval = setInterval(() => {
        setPing(getRandomPing());
      }, 1000);

      // توقف بعد از 5 ثانیه
      timeout = setTimeout(() => {
        setIsChecking(false);
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isChecking]);

  const handleClick = () => {
    setIsChecking(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {ping !== null && (
        <div className="text-2xl font-bold">
          Ping:{" "}
          <span className={ping !== null ? getPingColor(ping) : ""}>
            {ping !== null ? `${ping} ms` : ""}
          </span>
        </div>
      )}
      <ShinyButton
        className={`${isChecking ? "opacity-50 cursor-not-allowed" : ""}`}
        {...(isChecking ? {} : { onClick: handleClick })}
      >
        {isChecking ? "در حال چک کردن..." : "شروع چک کردن Ping"}
      </ShinyButton>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

interface TypedPromptProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypedPrompt({
  text,
  speed = 40,
  onComplete,
}: TypedPromptProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onCompleteRef.current?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className="font-display font-bold text-xl sm:text-2xl text-[var(--accent)] leading-relaxed">
      <span aria-hidden="true">{displayed}</span>
      <span
        className={`inline-block w-[2px] h-[1.1em] bg-[var(--accent)] ml-[2px] align-middle ${
          done ? "animate-blink" : ""
        }`}
      />
      <span className="sr-only">{text}</span>
    </p>
  );
}

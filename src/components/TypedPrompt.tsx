"use client";

import { useState, useEffect, useRef } from "react";

// Track which texts have already been typed so remounts show instantly
const typedTexts = new Set<string>();

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
  const alreadyTyped = typedTexts.has(text);
  const [displayed, setDisplayed] = useState(alreadyTyped ? text : "");
  const [done, setDone] = useState(alreadyTyped);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // If already typed this text before, show instantly
    if (typedTexts.has(text)) {
      setDisplayed(text);
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

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
        typedTexts.add(text);
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

/** Call this to reset typed state (e.g. when starting a new search) */
export function resetTypedPrompts() {
  typedTexts.clear();
}

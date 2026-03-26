"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fullText = "What are you sampling?";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTypingDone(true);
        setTimeout(() => setInputVisible(true), 200);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    router.push(`/search?song=${encodeURIComponent(inputValue.trim())}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Wordmark — Liquid Glass effect */}
      <h1 className="liquid-glass font-display font-extrabold text-[clamp(2.5rem,10vw,6rem)] tracking-tight mb-12 select-none">
        Clear Wax
      </h1>

      {/* Typed prompt */}
      <div className="flex items-center gap-0 mb-8">
        <p className="font-mono text-lg sm:text-xl text-[var(--text-mid)]">
          {typedText}
          <span
            className={`inline-block w-[2px] h-[1.1em] bg-white ml-[2px] align-middle ${
              typingDone ? "animate-blink" : ""
            }`}
          />
        </p>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-lg transition-all duration-500 ease-out ${
          inputVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='e.g. Think — James Brown'
          className="w-full bg-transparent border border-[var(--border-active)] rounded-lg px-5 py-4 font-mono text-base text-white placeholder:text-[var(--text-dim)] focus:outline-none focus:border-white transition-colors duration-200"
          aria-label="Song you are sampling"
        />
        <p className="text-center text-[var(--text-dim)] font-mono text-xs mt-4">
          Press Enter to continue
        </p>
      </form>

      {/* Tagline */}
      <p className="absolute bottom-8 font-mono text-xs text-[var(--text-dim)] tracking-wide">
        Clear the wax. Sample with confidence.
      </p>
    </div>
  );
}

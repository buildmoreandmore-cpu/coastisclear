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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      {/* Typed prompt */}
      <div className="flex items-center gap-0 mb-8 relative z-10">
        <p className="font-mono text-lg sm:text-xl text-[var(--text-mid)]">
          {typedText}
          <span
            className={`inline-block w-[2px] h-[1.1em] bg-[var(--text)] ml-[2px] align-middle ${
              typingDone ? "animate-blink" : ""
            }`}
          />
        </p>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-lg transition-all duration-500 ease-out relative z-10 ${
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
          className="w-full bg-transparent border-none outline-none font-mono text-lg text-[var(--text)] placeholder:text-[var(--text-dim)] caret-[var(--text)] text-center"
          aria-label="Song you are sampling"
        />
      </form>

      {/* Tagline */}
      <p className="absolute bottom-8 font-mono text-xs text-[var(--text-dim)] tracking-wide z-10">
        Clear the wax. Sample with confidence.
      </p>
    </div>
  );
}

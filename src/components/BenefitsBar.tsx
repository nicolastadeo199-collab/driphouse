"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Envíos a todo el país 🚚",
  "100% originales, garantizado ✅",
  "Lun a Vie 12-20hs · Sáb 16-00hs",
];

export default function BenefitsBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-border bg-black px-4 py-2 text-center text-xs font-semibold text-accent">
      <p className="md:hidden">{MESSAGES[index]}</p>
      <div className="hidden items-center justify-center gap-8 md:flex">
        {MESSAGES.map((message) => (
          <span key={message}>{message}</span>
        ))}
      </div>
    </div>
  );
}

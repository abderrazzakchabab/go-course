"use client";
import { useState } from "react";
import { chapters } from "@/lib/curriculum";

const DEFAULT_STARTER = `package main

import "fmt"

func main() {
    fmt.Println("hello, go")
}
`;

function starterFor(verifyId?: string): string {
  if (!verifyId) return DEFAULT_STARTER;
  for (const c of chapters) {
    if (c.lab?.verifyId === verifyId && c.lab.starter) return c.lab.starter;
  }
  return DEFAULT_STARTER;
}

export function Terminal({ verifyId, goal }: { verifyId?: string; goal?: string }) {
  const [code, setCode] = useState<string>(() => starterFor(verifyId));
  const [copied, setCopied] = useState(false);

  const runOnPlayground = () => {
    const opened = window.open("https://go.dev/play/", "_blank", "noopener");
    if (opened) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const reset = () => setCode(starterFor(verifyId));

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-glow">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/70" />
          <span className="w-3 h-3 rounded-full bg-amber-500/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs font-mono text-slate-400">main.go</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="cursor-pointer text-xs px-3 py-1 rounded-lg border border-slate-700 hover:border-accent2/60 hover:text-accent2 transition-colors duration-200"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={runOnPlayground}
            className="cursor-pointer text-xs px-3 py-1 rounded-lg bg-accent/15 text-accent border border-accent/40 hover:bg-accent/25 transition-colors duration-200"
          >
            Run on Go Playground ↗
          </button>
          <button
            onClick={reset}
            className="cursor-pointer text-xs px-3 py-1 rounded-lg border border-slate-700 hover:border-rose-500/60 hover:text-rose-300 transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </div>
      <textarea
        spellCheck={false}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full min-h-[320px] bg-slate-950 text-slate-100 font-mono text-sm p-4 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y leading-relaxed"
      />
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-700 text-xs text-slate-500 font-mono flex items-center justify-between">
        <span>edit the code, then run on go.dev/play (opens in a new tab, code copied to clipboard)</span>
        {goal && <span className="text-slate-400 ml-4">goal: {goal}</span>}
      </div>
    </div>
  );
}

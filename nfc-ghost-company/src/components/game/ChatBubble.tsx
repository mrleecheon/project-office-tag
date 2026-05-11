"use client";

import { motion } from "framer-motion";

export type ChatBubbleRole = "system" | "user";

interface ChatBubbleProps {
  role: ChatBubbleRole;
  senderLabel: string;
  children: React.ReactNode;
}

export function ChatBubble({ role, senderLabel, children }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ring-1 ${
          isUser
            ? "rounded-br-md bg-emerald-950/80 text-emerald-50 ring-emerald-800/60"
            : "rounded-bl-md bg-zinc-900/90 text-zinc-100 ring-zinc-700/70"
        }`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {senderLabel}
        </p>
        <div className="mt-1 text-sm leading-relaxed">{children}</div>
      </div>
    </motion.article>
  );
}

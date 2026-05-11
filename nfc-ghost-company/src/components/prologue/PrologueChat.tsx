"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatBubble } from "@/components/game/ChatBubble";
import { useGameStore } from "@/store/gameStore";

type ChatLine = {
  id: string;
  role: "system" | "user";
  senderLabel: string;
  body: string;
};

type FlowPhase =
  | "playing_intro"
  | "await_nickname"
  | "playing_post_name"
  | "await_ack_choice"
  | "done";

const HR_LABEL = "HR_AUTOMATION // NFC";

export function PrologueChat() {
  const nicknameInputId = useId();
  const setPlayerNickname = useGameStore((s) => s.setPlayerNickname);
  const playerNickname = useGameStore((s) => s.playerNickname);
  const completeTutorial = useGameStore((s) => s.completeTutorial);
  const setChoiceFlag = useGameStore((s) => s.setChoiceFlag);

  const [lines, setLines] = useState<ChatLine[]>([]);
  const [phase, setPhase] = useState<FlowPhase>("playing_intro");
  const [nicknameDraft, setNicknameDraft] = useState("");
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const introTimersRef = useRef<number[]>([]);

  const appendLine = useCallback((line: Omit<ChatLine, "id">) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setLines((prev) => [...prev, { ...line, id }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines, phase]);

  /** Scheduled intro messages with staggered delays */
  useEffect(() => {
    if (phase !== "playing_intro") return;

    const schedule = (delayMs: number, fn: () => void) => {
      const t = window.setTimeout(fn, delayMs);
      introTimersRef.current.push(t);
    };

    schedule(500, () =>
      appendLine({
        role: "system",
        senderLabel: HR_LABEL,
        body: "Welcome to the NFC internal onboarding channel.",
      })
    );
    schedule(1700, () =>
      appendLine({
        role: "system",
        senderLabel: HR_LABEL,
        body: "This session is logged. Identify yourself for the live roster.",
      })
    );
    schedule(3100, () =>
      appendLine({
        role: "system",
        senderLabel: HR_LABEL,
        body: "Enter the nickname your badge will display.",
      })
    );
    schedule(4300, () => setPhase("await_nickname"));

    return () => {
      introTimersRef.current.forEach((t) => window.clearTimeout(t));
      introTimersRef.current = [];
    };
  }, [phase, appendLine]);

  const submitNickname = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nicknameDraft.trim();
    if (trimmed.length < 1) {
      setNicknameError("A visible nickname is required.");
      return;
    }
    if (trimmed.length > 24) {
      setNicknameError("Keep it under 24 characters.");
      return;
    }
    setNicknameError(null);
    setPlayerNickname(trimmed);
    appendLine({
      role: "user",
      senderLabel: trimmed,
      body: trimmed,
    });
    setNicknameDraft("");
    setPhase("playing_post_name");
  };

  /** Post-name script */
  useEffect(() => {
    if (phase !== "playing_post_name" || !playerNickname) return;

    const timers: number[] = [];
    const schedule = (delayMs: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, delayMs));
    };

    schedule(600, () =>
      appendLine({
        role: "system",
        senderLabel: HR_LABEL,
        body: `Acknowledged: ${playerNickname}. Your predecessor's mailbox is still syncing—delay noise is expected.`,
      })
    );
    schedule(2100, () =>
      appendLine({
        role: "system",
        senderLabel: HR_LABEL,
        body: "Before we release floor access, confirm you understand that exit events are audited in real time.",
      })
    );
    schedule(3600, () => setPhase("await_ack_choice"));

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [phase, playerNickname, appendLine]);

  const onAcknowledge = () => {
    appendLine({
      role: "user",
      senderLabel: playerNickname ?? "You",
      body: "I acknowledge. Proceed with floor access.",
    });
    setChoiceFlag("prologue_hr_ack", true);
    setPhase("done");
    window.setTimeout(() => completeTutorial(), 1200);
  };

  const showNicknameForm = phase === "await_nickname";
  const showBranch = phase === "await_ack_choice" || phase === "done";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0b0e14] text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 py-3 backdrop-blur-md">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Secure thread
          </p>
          <h1 className="text-sm font-medium text-zinc-200">
            Onboarding • Replacement Hire
          </h1>
        </div>
        <span className="rounded-full bg-emerald-950/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-700/50">
          Live
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        <div className="mx-auto flex max-w-md flex-col gap-3">
          {lines.map((line) => (
            <ChatBubble
              key={line.id}
              role={line.role}
              senderLabel={line.senderLabel}
            >
              {line.body}
            </ChatBubble>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      <footer className="border-t border-zinc-800/80 bg-zinc-950/90 px-3 py-3 backdrop-blur-md sm:px-4">
        <div className="mx-auto flex max-w-md flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {showNicknameForm && (
              <motion.form
                key="nickname-form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                onSubmit={submitNickname}
                className="flex flex-col gap-2"
              >
                <label
                  htmlFor={nicknameInputId}
                  className="text-xs font-medium text-zinc-400"
                >
                  Onboarding nickname
                </label>
                <div className="flex gap-2">
                  <input
                    id={nicknameInputId}
                    autoComplete="nickname"
                    maxLength={24}
                    placeholder="e.g. M. Reeves"
                    value={nicknameDraft}
                    onChange={(e) => setNicknameDraft(e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/50"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                  >
                    Send
                  </button>
                </div>
                {nicknameError && (
                  <p className="text-xs text-red-400">{nicknameError}</p>
                )}
              </motion.form>
            )}

            {showBranch && (
              <motion.div
                key="branch"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
              >
                <p className="text-xs text-zinc-500">Required response</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={phase === "done"}
                    onClick={onAcknowledge}
                    className="rounded-lg border border-emerald-700/70 bg-emerald-950/50 px-4 py-2 text-left text-sm text-emerald-100 transition-colors hover:bg-emerald-900/60 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    I acknowledge. Proceed with floor access.
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {phase === "done" && (
            <p className="text-center text-[11px] text-zinc-500">
              Chapter 1 unlocks — prototype continues here in the next step.
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

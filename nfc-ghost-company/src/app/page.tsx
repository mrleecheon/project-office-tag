"use client";

import { CorporateSplash } from "@/components/prologue/CorporateSplash";
import { PrologueChat } from "@/components/prologue/PrologueChat";
import { useGameStore } from "@/store/gameStore";

export default function Home() {
  const prologueScreen = useGameStore((s) => s.prologueScreen);

  return (
    <div className="flex min-h-[100dvh] flex-1 flex-col bg-[#07090f]">
      {prologueScreen === "splash" ? (
        <CorporateSplash />
      ) : (
        <PrologueChat />
      )}
    </div>
  );
}

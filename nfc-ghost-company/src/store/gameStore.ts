import { create } from "zustand";

/** Main story segmentation (Tutorial = Chapter 0) */
export type ChapterId =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7;

export type PrologueScreen = "splash" | "messenger";

interface GameStore {
  chapter: ChapterId;
  /** Display name captured during the prologue onboarding chat */
  playerNickname: string | null;
  /** Sub-view within Chapter 0 */
  prologueScreen: PrologueScreen;
  /** Collected investigation evidence ids (stub for later chapters) */
  evidenceIds: string[];
  /** Narrative flags from branching choices (stub) */
  choiceFlags: Record<string, boolean>;
  /** True after the player finishes the tutorial handshake */
  tutorialComplete: boolean;

  setPrologueScreen: (screen: PrologueScreen) => void;
  setPlayerNickname: (nickname: string) => void;
  setChapter: (chapter: ChapterId) => void;
  addEvidence: (id: string) => void;
  setChoiceFlag: (key: string, value: boolean) => void;
  completeTutorial: () => void;
  resetGame: () => void;
}

const initialState = {
  chapter: 0 as ChapterId,
  playerNickname: null as string | null,
  prologueScreen: "splash" as PrologueScreen,
  evidenceIds: [] as string[],
  choiceFlags: {} as Record<string, boolean>,
  tutorialComplete: false,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setPrologueScreen: (screen) => set({ prologueScreen: screen }),

  setPlayerNickname: (nickname) => {
    const trimmed = nickname.trim();
    set({ playerNickname: trimmed.length > 0 ? trimmed : null });
  },

  setChapter: (chapter) => set({ chapter }),

  addEvidence: (id) =>
    set((s) =>
      s.evidenceIds.includes(id)
        ? s
        : { evidenceIds: [...s.evidenceIds, id] }
    ),

  setChoiceFlag: (key, value) =>
    set((s) => ({
      choiceFlags: { ...s.choiceFlags, [key]: value },
    })),

  completeTutorial: () => set({ tutorialComplete: true, chapter: 1 }),

  resetGame: () => set({ ...initialState }),
}));

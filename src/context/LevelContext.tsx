import {
  createContext,
  useContext,
  useState,
  useEffect,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const LEVEL_KEY = "level";

//read the level straight into initial state rather than in an effect, so the first paint already
//has the right level - otherwise an order could be generated for level 1 before the effect runs.
//sessionStorage throws outright when storage is blocked, and a hand-edited key would render as NaN
const readLevel = (): number => {
  try {
    const stored = sessionStorage.getItem(LEVEL_KEY);
    if (!stored) return 1;

    const parsed = Number(stored);

    return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
  } catch {
    return 1;
  }
};

type LevelContextType = {
  level: number;
  setLevel: Dispatch<SetStateAction<number>>;
};

const LevelContext = createContext<LevelContextType | undefined>(undefined);

type LevelProviderProps = {
  children: ReactNode;
};

export function LevelProvider({ children }: LevelProviderProps) {
  const [level, setLevel] = useState<number>(readLevel);

  //write back on every change so a reload resumes at the level they reached
  useEffect(() => {
    try {
      sessionStorage.setItem(LEVEL_KEY, String(level));
    } catch {
      //storage is blocked - the level still counts for this session, it just won't survive a reload
    }
  }, [level]);

  return (
    <LevelContext.Provider value={{ level, setLevel }}>
      {children}
    </LevelContext.Provider>
  );
}

// Custom hook for consuming the context
export function useLevel() {
  const context = useContext(LevelContext);

  if (context === undefined) {
    throw new Error("useLevel must be used within a LevelProvider");
  }

  return context;
}

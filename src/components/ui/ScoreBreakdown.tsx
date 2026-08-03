import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "motion/react";
import { ScoreText } from "./ScoreText";
import type { RoundScoreResult } from "../../types";

//how far apart each line sits, and how long the reveal/hold/fly phases take
const ROW_HEIGHT = 26;
const GAP_BELOW_SCORE = 10;
const APPEAR_STAGGER = 0.15; //seconds between each line appearing
const FLY_STAGGER = 0.2; //seconds between each line flying off
const FLY_DURATION = 0.5; //seconds for a line's fly-into-score animation
const HOLD_TIME = 3000; //ms all lines sit still so the player can read them

const Wrapper = styled.div`
  position: relative;
`;

const BreakdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${GAP_BELOW_SCORE}px;
  pointer-events: none;
`;

const BreakdownLine = styled(motion.div)<{ $positive: boolean }>`
  height: ${ROW_HEIGHT}px;
  line-height: ${ROW_HEIGHT}px;
  font-family:
    Indie Flower,
    cursive;
  font-size: 16px;
  color: ${(props) => (props.$positive ? "#b6f7a8" : "#ff9a8a")};
  text-shadow: 0 0 8px ${(props) => (props.$positive ? "#92f58d" : "#ff5f4d")};
  white-space: nowrap;
`;

type ScoreBreakdownProps = {
  totalScore: number;
  roundResult: RoundScoreResult | null;
  onRoundResultConsumed: () => void;
};

export const ScoreBreakdown = ({
  totalScore,
  roundResult,
  onRoundResultConsumed,
}: ScoreBreakdownProps) => {
  const [phase, setPhase] = useState<"idle" | "appearing" | "flying">("idle");
  const [displayScore, setDisplayScore] = useState(totalScore);

  //kick off a new reveal/fly sequence whenever a round finishes
  useEffect(() => {
    if (!roundResult) return;

    setDisplayScore(roundResult.previousTotal);
    setPhase("appearing");

    const appearTime = roundResult.items.length * APPEAR_STAGGER * 1000;
    const flyTimer = setTimeout(() => {
      setPhase("flying");
    }, appearTime + HOLD_TIME);

    return () => clearTimeout(flyTimer);
  }, [roundResult]);

  if (!roundResult) {
    return (
      <Wrapper>
        <ScoreText>Score: {totalScore}</ScoreText>
      </Wrapper>
    );
  }

  const { items } = roundResult;

  const handleLineComplete = (index: number, value: number) => {
    if (phase !== "flying") return; //ignore the appear animation's completion

    setDisplayScore((prev) => prev + value);

    if (index === items.length - 1) {
      setPhase("idle");
      onRoundResultConsumed();
    }
  };

  return (
    <Wrapper>
      <ScoreText>
        Score: {phase === "idle" ? totalScore : displayScore}
      </ScoreText>

      <BreakdownList>
        <AnimatePresence>
          {phase !== "idle" &&
            items.map((item, index) => {
              const flyDistance =
                GAP_BELOW_SCORE + ROW_HEIGHT * index + ROW_HEIGHT / 2;

              return (
                <BreakdownLine
                  key={`${item.label}-${index}`}
                  $positive={item.value > 0}
                  initial={{ opacity: 0, y: -8 }}
                  animate={
                    phase === "flying"
                      ? { opacity: 0, y: -flyDistance, scale: 0.5 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  transition={
                    phase === "flying"
                      ? {
                          delay: index * FLY_STAGGER,
                          duration: FLY_DURATION,
                          ease: "easeIn",
                        }
                      : { delay: index * APPEAR_STAGGER, duration: 0.3 }
                  }
                  onAnimationComplete={() =>
                    handleLineComplete(index, item.value)
                  }
                >
                  {item.value > 0 ? "+" : "−"}
                  {Math.abs(item.value)} {item.label}
                </BreakdownLine>
              );
            })}
        </AnimatePresence>
      </BreakdownList>
    </Wrapper>
  );
};

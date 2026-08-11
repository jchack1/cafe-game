import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { motion, AnimatePresence } from "motion/react";
import { ScoreText } from "./ScoreText";
import { Z_LAYERS } from "../../zLayers";
import type { RoundScoreResult } from "../../types";
import { Sparkles } from "./messages/Sparkles";

//how far apart each line sits, and how long the reveal/hold/fly phases take
const ROW_HEIGHT = 26;
const GAP_BELOW_SCORE = 10;
const APPEAR_STAGGER = 0.15; //seconds between each line appearing
const FLY_STAGGER = 0.2; //seconds between each line flying off
const FLY_DURATION = 0.5; //seconds for a line's fly-into-score animation
const HOLD_TIME = 3000; //ms all lines sit still so the player can read them

//the welcome-back animation: a returning player's best score blooms in the middle of the page, holds
//there, then shrinks down into its resting slot under the current score
const HIGH_SCORE_ROW_HEIGHT = 22;
const INTRO_SCALE = 3.5; //how much bigger it is mid-page than at rest
const INTRO_MAX_WIDTH = 0.9; //fraction of the screen the blown-up score is allowed to span
const INTRO_GROW_DURATION = 0.6;
const INTRO_SETTLE_DURATION = 0.8;
const INTRO_HOLD_TIME = 2500; //ms it sits big in the middle before shrinking away

//"measuring" is the one frame we need before we know where the resting slot is
type IntroPhase = "measuring" | "growing" | "settling" | "done";

//score sits above draggable ingredients
const Wrapper = styled.div`
  position: relative;
  z-index: ${Z_LAYERS.ui};
`;

//holds the current score's place in the layout even while it's hidden for the intro, so nothing below
//it shifts when it fades in
const ScoreHeader = styled(motion.div)``;

//reserves the high score's resting place in the flow. measuring this tells us where the intro has to
//land, and keeping it in the flow is what pushes the breakdown lines further down the page
const HighScoreSlot = styled.div`
  height: ${HIGH_SCORE_ROW_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const highScoreType = css`
  font-family:
    Indie Flower,
    cursive;
  font-size: 14px;
  color: #ffe9a8;
  text-shadow: 0 0 10px #f5c542;
  white-space: nowrap;
  pointer-events: none;
`;

//position: relative so the sparkles, which are absolute, scatter across the score itself
const HighScoreText = styled(motion.div)`
  ${highScoreType}
  position: relative;
`;

//stands in for the real thing on the measuring frame. laid out but not painted, so we can read the
//text's natural width and cap the bloom before a long score runs off a narrow screen
const HighScoreMeasure = styled.div`
  ${highScoreType}
  visibility: hidden;
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
  highScore: number;
  roundResult: RoundScoreResult | null;
  onRoundResultConsumed: () => void;
};

export const ScoreBreakdown = ({
  totalScore,
  highScore,
  roundResult,
  onRoundResultConsumed,
}: ScoreBreakdownProps) => {
  const [phase, setPhase] = useState<"idle" | "appearing" | "flying">("idle");
  const [displayScore, setDisplayScore] = useState(totalScore);
  //a beaten high score lands with the main score at the end of the breakdown, not the moment the round
  //is scored - otherwise it gives the new total away while the lines are still flying
  const [displayHighScore, setDisplayHighScore] = useState(highScore);

  //a first-time player has nothing to welcome back, so the high score stays off screen for their whole
  //first session - it only turns up on the visit after they've set one. captured at mount rather than
  //read live, so beating a nonexistent score mid-game doesn't pop the row into view
  const [hadSavedHighScore] = useState<boolean>(() => highScore > 0);
  const [intro, setIntro] = useState<IntroPhase>(
    hadSavedHighScore ? "measuring" : "done",
  );
  const slotRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [introStart, setIntroStart] = useState<{
    x: number;
    y: number;
    scale: number;
  } | null>(null);

  //work out how far the resting slot sits from the middle of the page - the intro starts there and
  //animates home. has to be a layout effect: it runs before the browser paints, so the high score is
  //never visible sitting in its small resting spot before the animation takes over
  useLayoutEffect(() => {
    if (intro !== "measuring" || !slotRef.current || !measureRef.current)
      return;

    const slot = slotRef.current.getBoundingClientRect();
    const text = measureRef.current.getBoundingClientRect();

    //a five-figure score at full size overruns a phone screen, so shrink the bloom to fit
    const maxScale =
      text.width > 0
        ? (window.innerWidth * INTRO_MAX_WIDTH) / text.width
        : INTRO_SCALE;

    setIntroStart({
      x: window.innerWidth / 2 - (slot.left + slot.width / 2),
      y: window.innerHeight / 2 - (slot.top + slot.height / 2),
      scale: Math.min(INTRO_SCALE, maxScale),
    });
    setIntro("growing");
  }, [intro]);

  //let it sit big in the middle for a beat before it shrinks into place
  useEffect(() => {
    if (intro !== "growing") return;

    const settleTimer = setTimeout(
      () => setIntro("settling"),
      INTRO_GROW_DURATION * 1000 + INTRO_HOLD_TIME,
    );

    return () => clearTimeout(settleTimer);
  }, [intro]);

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

  const items = roundResult?.items ?? [];

  const handleLineComplete = (index: number, value: number) => {
    if (phase !== "flying") return; //ignore the appear animation's completion

    setDisplayScore((prev) => prev + value);

    if (index === items.length - 1) {
      setPhase("idle");
      setDisplayHighScore(highScore); //catches up with the total the player just landed on
      onRoundResultConsumed();
    }
  };

  //the current score would just read "Score: 0" while the intro plays, so hold it back until the high
  //score is on its way down to make room for it
  const showCurrentScore = intro === "settling" || intro === "done";

  //the breakdown lines fly up into the score, so they have to clear the high score row sitting between
  const highScoreOffset = hadSavedHighScore ? HIGH_SCORE_ROW_HEIGHT : 0;

  return (
    <Wrapper>
      <ScoreHeader
        initial={false}
        animate={{ opacity: showCurrentScore ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <ScoreText>
          Score: {phase === "idle" ? totalScore : displayScore}
        </ScoreText>
      </ScoreHeader>

      {hadSavedHighScore && (
        <HighScoreSlot ref={slotRef}>
          {/* held back for the measuring frame, so it can mount already positioned mid-page */}
          {intro === "measuring" && (
            <HighScoreMeasure ref={measureRef}>
              High score: {displayHighScore}
            </HighScoreMeasure>
          )}

          {introStart && (
            <HighScoreText
              className="high-score-sparkle-container"
              initial={{
                opacity: 0,
                scale: 0,
                x: introStart.x,
                y: introStart.y,
              }}
              animate={
                intro === "growing"
                  ? {
                      opacity: 1,
                      scale: introStart.scale,
                      x: introStart.x,
                      y: introStart.y,
                    }
                  : { opacity: 1, scale: 1, x: 0, y: 0 }
              }
              transition={
                intro === "growing"
                  ? { duration: INTRO_GROW_DURATION, ease: "backOut" }
                  : { duration: INTRO_SETTLE_DURATION, ease: "easeInOut" }
              }
              onAnimationComplete={() => {
                if (intro === "settling") setIntro("done");
              }}
            >
              {/* only while it's big in the middle - they'd be a distraction twinkling away under
                  the score for the rest of the game */}
              {intro === "growing" && <Sparkles />}
              High score: {displayHighScore}
            </HighScoreText>
          )}
        </HighScoreSlot>
      )}

      <BreakdownList>
        <AnimatePresence>
          {phase !== "idle" &&
            items.map((item, index) => {
              const flyDistance =
                highScoreOffset +
                GAP_BELOW_SCORE +
                ROW_HEIGHT * index +
                ROW_HEIGHT / 2;

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

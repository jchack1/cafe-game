//decorative hanging plant, anchored to a top corner of the wall - free to overflow off the top/side of the screen
import styled from "styled-components";
import { MUTED_DECOR_FILTER, MUTED_DECOR_OPACITY } from "./decorStyles";

type HangingPlantProps = {
  side: "left" | "right";
};

const PLANT_SRC = "/images/background-items/Hanging-Plant.svg";

const PlantImg = styled.img<{ $side: "left" | "right" }>`
  position: absolute;
  top: -40px;
  ${(props) => (props.$side === "left" ? "left: -25px;" : "right: -25px;")}
  ${(props) => props.$side === "right" && "transform: scaleX(-1);"}

  width: 280px;
  height: auto;

  /* mute the vivid illustrator greens so it sits back into the wall rather than popping off it */
  opacity: ${MUTED_DECOR_OPACITY};
  filter: ${MUTED_DECOR_FILTER};

  /* step down on mid-size screens */
  @media (max-width: 900px) {
    top: -30px;
    width: 195px;
  }

  /* on narrow screens the score/buttons sit close to this corner - shrink and tuck further off-edge so it doesn't cover them */
  @media (max-width: 600px) {
    top: -14px;
    ${(props) => (props.$side === "left" ? "left: -35px;" : "right: -35px;")}
    width: 115px;
  }
`;

export const HangingPlant = ({ side }: HangingPlantProps) => {
  return <PlantImg src={PLANT_SRC} alt="" $side={side} />;
};

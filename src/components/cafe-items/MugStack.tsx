//a single decorative stack of clean mugs pushed into the left corner of the counter, against the back wall.
//its base sits on the wood and the rest rises up over the wall, so it reads as resting on the counter.
import styled from "styled-components";
import { MUTED_DECOR_FILTER, MUTED_DECOR_OPACITY } from "./decorStyles";

const MUG_STACK_SRC = "/images/background-items/Mug-Stack.svg";

//px of the stack's base that sits on the wood; everything above this overlaps the wall
const OVERLAP_ONTO_COUNTER = 55;

const StackImg = styled.img`
  position: absolute;
  bottom: calc(100% - ${OVERLAP_ONTO_COUNTER}px);
  left: 20px;

  width: 150px;
  height: auto;
  display: block;

  pointer-events: none;
  z-index: 0;

  filter: ${MUTED_DECOR_FILTER};
  opacity: ${MUTED_DECOR_OPACITY};

  @media (max-width: 900px) {
    width: 115px;
    bottom: calc(100% - 42px);
  }

  @media (max-width: 600px) {
    width: 78px;
    left: 8px;
    bottom: calc(100% - 28px);
  }
`;

export const MugStack = () => {
  return <StackImg src={MUG_STACK_SRC} alt="" />;
};

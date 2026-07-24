//a single decorative prop - the jar of coffee beans - sitting off to the right of the ingredient shelf.
//non-interactive; muted so it reads as background rather than competing with the shelf ingredients.
import styled from "styled-components";
import { MUTED_DECOR_FILTER, MUTED_DECOR_OPACITY } from "./decorStyles";

const JAR_SRC = "/images/background-items/Jar-beans.svg";

const JarImg = styled.img`
  position: absolute;
  bottom: 0;
  right: 8%;

  height: 95px;
  width: auto;
  display: block;

  pointer-events: none;
  z-index: 0;

  filter: ${MUTED_DECOR_FILTER};
  opacity: ${MUTED_DECOR_OPACITY};

  @media (max-width: 900px) {
    height: 74px;
    right: 5%;
  }

  @media (max-width: 600px) {
    height: 58px;
    right: 3%;
  }
`;

export const ShelfDecor = () => {
  return <JarImg src={JAR_SRC} alt="" />;
};

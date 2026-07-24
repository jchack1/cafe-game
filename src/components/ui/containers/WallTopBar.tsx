//top strip of the wall holding the buttons on one side and the score on the other.
//constrained to a centred band (rather than the full 100vw wall) so the buttons and score sit toward
//the middle of the screen instead of hugging the corners where the hanging plants are.
import styled from "styled-components";

export const WallTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0 16px;

  position: relative;
  z-index: 1;
`;

import styled from "styled-components";
import { Z_LAYERS } from "../../../zLayers";

//fills the wall. clips, so the hanging plants spill off the *edge of the screen* instead of widening the page
//being absolute is also what keeps the string lights out of the wall's flow: the wall is a fixed-height

export const WallDecorLayer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: ${Z_LAYERS.decor};
`;

//fills the counter. deliberately NOT clipped - these props stand on the counter's top edge and rise up
//onto the wall, so they have to be free to paint outside this box.
export const CounterDecorLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: ${Z_LAYERS.decor};
`;

//wrappers that pin the background props to the decor level and keep their private z-indexes from
//leaking into the rest of the scene (see zLayers.ts).
import styled from "styled-components";
import { Z_LAYERS } from "../../../zLayers";

//fills the wall. clips, so the hanging plants spill off the *edge of the screen* instead of widening
//the document - an overhang past the right edge grows the page's scroll width, which showed up as a
//white gap beside the wall and counter. clipping at the wall's bounds matches the viewport edges here,
//so the plants look exactly as they did, minus the overflow.
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

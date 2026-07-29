//decorative props sitting along the back of the counter, under the ingredient shelf.
//rendered inside the Counter (not the wall) so their bases can overlap the counter's top edge while the
//rest rises up onto the wall - the same trick the mug stack uses. non-interactive and muted.
import styled from "styled-components";
import { MUTED_DECOR_FILTER, MUTED_DECOR_OPACITY } from "./decorStyles";

const BASE = "/images/background-items/";

//each prop is centred on `left` (a % of the counter width) and stands on the counter's top edge.
//`overlap` is how many px of the base sit on the wood; everything above rises onto the wall.
type Prop = {
  src: string;
  height: number; //rendered height in px (for the lying spoons this is the spoon's length before rotation)
  left: number; //% of counter width, marks the prop's horizontal centre
  overlap: number; //px of the base resting on the counter
  rotate: number; //deg, pivoting on the base
  z: number; //stacking *within* this cluster only - contained by CounterDecorLayer
};

//one cluster over on the right of the counter: the plain jar and spoon cup stood beside the coffee-bean
//jar, with two teaspoons lying flat alongside. everything upright (not tilted); bases dip onto the counter.
//listed left to right.
const PROPS: Prop[] = [
  { src: "Single-Spoon.svg", height: 100, left: 64, overlap: 44, rotate: 90, z: 1 },
  { src: "Single-Spoon.svg", height: 94, left: 68, overlap: 48, rotate: 94, z: 2 },
  { src: "Plain-Jar.svg", height: 82, left: 72, overlap: 22, rotate: 0, z: 4 },
  { src: "Spoon-Cup.svg", height: 120, left: 80, overlap: 24, rotate: 0, z: 3 },
  { src: "Jar-beans.svg", height: 115, left: 88, overlap: 22, rotate: 0, z: 2 },
];

const PropImg = styled.img<{
  $height: number;
  $left: number;
  $overlap: number;
  $rotate: number;
  $z: number;
}>`
  position: absolute;
  /* base sits 'overlap' px down from the counter's top edge, so it rests on the wood and rises onto the wall */
  bottom: calc(100% - ${(props) => props.$overlap}px);
  left: ${(props) => props.$left}%;

  height: ${(props) => props.$height}px;
  width: auto;
  display: block;

  transform: translateX(-50%) rotate(${(props) => props.$rotate}deg);
  transform-origin: bottom center;
  z-index: ${(props) => props.$z};

  pointer-events: none;

  filter: ${MUTED_DECOR_FILTER};
  opacity: ${MUTED_DECOR_OPACITY};

  @media (max-width: 900px) {
    height: ${(props) => props.$height * 0.78}px;
    bottom: calc(100% - ${(props) => props.$overlap * 0.78}px);
  }

  @media (max-width: 600px) {
    height: ${(props) => props.$height * 0.6}px;
    bottom: calc(100% - ${(props) => props.$overlap * 0.6}px);
  }

  /* a phone held sideways leaves the counter only ~200px tall, with the shelf pushed right down onto it -
     there's simply no room for clutter under the shelf, so drop the lot. the mug stack stays: it's off in
     the corner rather than under the shelf. */
  @media (max-height: 500px) and (orientation: landscape) {
    display: none;
  }
`;

export const CounterDecor = () => {
  return (
    <>
      {PROPS.map((prop, i) => (
        <PropImg
          key={i}
          src={`${BASE}${prop.src}`}
          alt=""
          $height={prop.height}
          $left={prop.left}
          $overlap={prop.overlap}
          $rotate={prop.rotate}
          $z={prop.z}
        />
      ))}
    </>
  );
};

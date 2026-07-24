//whimsical hanging string lights - a repeating tile (one sagging wire + a handful of bulbs)
//copied across the width of the wall so the wire never stretches, just repeats
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

type Point = { x: number; y: number };

//fixed coordinate space the swag/bulbs are drawn in - the rendered pixel size scales this uniformly, never stretches it
const VIEWBOX_WIDTH = 360;
const VIEWBOX_HEIGHT = 70;
const TILE_ASPECT_RATIO = VIEWBOX_HEIGHT / VIEWBOX_WIDTH;

//how big a tile renders at most, and the fewest tiles we ever want visible at once (smaller screens shrink the tile to guarantee this)
const MAX_TILE_RENDER_WIDTH = 360;
const MIN_VISIBLE_TILES = 2;

//single swag per tile - wire dips from one nail at the tile's left edge to one at the right edge
const SWAG = {
  p0: { x: 0, y: 6 },
  c: { x: VIEWBOX_WIDTH / 2, y: 60 },
  p1: { x: VIEWBOX_WIDTH, y: 6 },
};

//consistent whitish-warm-yellow palette instead of a rainbow
const BULB_COLOURS = ["#fffdf3", "#fff3c4", "#ffe9a0", "#fff7dc"];

const WIRE_COLOUR = "#e6d9b8";

//sample points along the swag's curve to hang bulbs from
const SAMPLE_TS = [0.15, 0.32, 0.5, 0.68, 0.85];

//bulbs hang at varied angles/lengths instead of all pointing straight down, for a looser, whimsical feel
const ANGLE_OFFSETS_DEG = [-35, 20, -10, 30, -25, 5, 15, -20];
const DROP_LENGTHS = [9, 13, 11, 15, 10, 12, 14, 9];
const DURATIONS = [1.8, 2.2, 2.6, 2.0, 2.4];

const quadPoint = (t: number): Point => {
  const { p0, c, p1 } = SWAG;
  const oneMinusT = 1 - t;
  return {
    x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * c.x + t * t * p1.x,
    y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * c.y + t * t * p1.y,
  };
};

const WIRE_PATH = `M ${SWAG.p0.x} ${SWAG.p0.y} Q ${SWAG.c.x} ${SWAG.c.y} ${SWAG.p1.x} ${SWAG.p1.y}`;

type Bulb = {
  wire: Point;
  bulb: Point;
  colour: string;
  delay: number;
  duration: number;
};

//tileIndex offsets which angle/colour/timing each bulb gets, so repeated tiles don't look perfectly identical
const getBulbsForTile = (tileIndex: number): Bulb[] =>
  SAMPLE_TS.map((t, i) => {
    const wire = quadPoint(t);
    const globalIndex = tileIndex * SAMPLE_TS.length + i;
    const angleDeg = ANGLE_OFFSETS_DEG[globalIndex % ANGLE_OFFSETS_DEG.length];
    const dropLength = DROP_LENGTHS[globalIndex % DROP_LENGTHS.length];
    const angleRad = (angleDeg * Math.PI) / 180;

    return {
      wire,
      bulb: {
        x: wire.x + dropLength * Math.sin(angleRad),
        y: wire.y + dropLength * Math.cos(angleRad),
      },
      colour: BULB_COLOURS[globalIndex % BULB_COLOURS.length],
      delay: (globalIndex % 5) * 0.3,
      duration: DURATIONS[globalIndex % DURATIONS.length],
    };
  });

const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LightsRow = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  line-height: 0;
`;

const Tile = styled.svg<{ $width: number; $height: number }>`
  flex: none;
  display: block;
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
`;

const BulbGroup = styled.g<{ $delay: number; $duration: number }>`
  animation: ${twinkle} ${(props) => props.$duration}s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay}s;
  transform-origin: center;
`;

type Layout = { renderWidth: number; renderHeight: number; tileCount: number };

//shrink the tile (uniformly, so it never distorts) below its ideal size when needed to keep MIN_VISIBLE_TILES on screen
const computeLayout = (viewportWidth: number): Layout => {
  const renderWidth = Math.min(
    MAX_TILE_RENDER_WIDTH,
    viewportWidth / MIN_VISIBLE_TILES,
  );
  const renderHeight = renderWidth * TILE_ASPECT_RATIO;
  const tileCount = Math.ceil(viewportWidth / renderWidth) + 1;

  return { renderWidth, renderHeight, tileCount };
};

const LightsTile = ({
  tileIndex,
  renderWidth,
  renderHeight,
}: {
  tileIndex: number;
  renderWidth: number;
  renderHeight: number;
}) => {
  const bulbs = getBulbsForTile(tileIndex);

  return (
    <Tile
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      $width={renderWidth}
      $height={renderHeight}
    >
      <path
        d={WIRE_PATH}
        stroke={WIRE_COLOUR}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {bulbs.map((b, i) => (
        <BulbGroup key={i} $delay={b.delay} $duration={b.duration}>
          <line
            x1={b.wire.x}
            y1={b.wire.y}
            x2={b.bulb.x}
            y2={b.bulb.y}
            stroke={WIRE_COLOUR}
            strokeWidth={1}
          />
          {/* soft glow halo behind the bulb */}
          <circle
            cx={b.bulb.x}
            cy={b.bulb.y}
            r={9}
            fill={b.colour}
            opacity={0.35}
          />
          <circle cx={b.bulb.x} cy={b.bulb.y} r={4.5} fill={b.colour} />
        </BulbGroup>
      ))}
    </Tile>
  );
};

export const StringLights = () => {
  const [layout, setLayout] = useState(() => computeLayout(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setLayout(computeLayout(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LightsRow>
      {Array.from({ length: layout.tileCount }).map((_, i) => (
        <LightsTile
          key={i}
          tileIndex={i}
          renderWidth={layout.renderWidth}
          renderHeight={layout.renderHeight}
        />
      ))}
    </LightsRow>
  );
};

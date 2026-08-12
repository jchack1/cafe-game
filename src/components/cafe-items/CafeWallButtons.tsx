import { Button } from "../ui/Button";
import { featureflag } from "../../feature-flags";
import styled from "styled-components";
import { Z_LAYERS } from "../../zLayers";
import { MAX_TILE_RENDER_HEIGHT } from "./StringLights";

type CafeWallButtonProps = {
  handleGetOrder: () => void;
  showRecipe: boolean;
  setShowRecipe: React.Dispatch<React.SetStateAction<boolean>>;
};

const TopFixedContainer = styled.div`
  /* pinned above the shelf and the ingredients on it. proportional (5vh) on tall screens, but on a
     short/landscape viewport 5vh shrinks to almost nothing and these opaque buttons land right on top
     of the string lights - clamp to their max height so the buttons never sit higher than that */
  z-index: ${Z_LAYERS.buttons};
  position: fixed;
  top: max(5vh, ${MAX_TILE_RENDER_HEIGHT}px);
  right: 0;
  left: 0;
  /* viewport-fit=cover lets content sit under the notch - keep the buttons clear of it */
  padding-top: env(safe-area-inset-top);
`;

const FlexButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const CafeWallButtons = ({
  handleGetOrder,
  showRecipe,
  setShowRecipe,
}: CafeWallButtonProps) => {
  return (
    <TopFixedContainer>
      <FlexButtonContainer>
        {/* get order button for dev only - orders load automatically in deployed game */}
        {featureflag.getOrderButton && (
          <Button onClick={handleGetOrder} style={{ alignSelf: "start" }}>
            Get order
          </Button>
        )}
        <Button
          onClick={() => setShowRecipe(!showRecipe)}
          style={{ alignSelf: "end" }}
        >
          {showRecipe ? "Hide Recipes" : "Show Recipes"}
        </Button>
      </FlexButtonContainer>
    </TopFixedContainer>
  );
};

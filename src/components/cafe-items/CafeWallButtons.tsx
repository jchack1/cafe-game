import { Button } from "../ui/Button";
import { featureflag } from "../../feature-flags";
import styled from "styled-components";
import { Z_LAYERS } from "../../zLayers";

type CafeWallButtonProps = {
  handleGetOrder: () => void;
  showRecipe: boolean;
  setShowRecipe: React.Dispatch<React.SetStateAction<boolean>>;
};

const TopFixedContainer = styled.div`
  /* pinned above the shelf and the ingredients on it */
  z-index: ${Z_LAYERS.ui};
  position: fixed;
  top: 5vh;
  right: 0;
  left: 0;
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

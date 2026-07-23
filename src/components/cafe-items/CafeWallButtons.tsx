import { Button } from "../ui/Button";
import { featureflag } from "../../feature-flags";

type CafeWallButtonProps = {
  handleGetOrder: () => void;
  showRecipe: boolean;
  setShowRecipe: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CafeWallButtons = ({
  handleGetOrder,
  showRecipe,
  setShowRecipe,
}: CafeWallButtonProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      {/* get order button for dev only - orders load automatically in deployed game */}
      {featureflag.getOrderButton && (
        <Button onClick={handleGetOrder} style={{ alignSelf: "start" }}>
          Get order
        </Button>
      )}
      <Button
        onClick={() => setShowRecipe(!showRecipe)}
        style={{ alignSelf: "start" }}
      >
        {showRecipe ? "Hide Recipes" : "Show Recipes"}
      </Button>
    </div>
  );
};

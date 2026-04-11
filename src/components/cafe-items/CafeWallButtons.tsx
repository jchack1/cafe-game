import { Button } from "../ui/Button";

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
      <Button onClick={handleGetOrder} style={{ alignSelf: "start" }}>
        Get order
      </Button>
      <Button
        onClick={() => setShowRecipe(!showRecipe)}
        style={{ alignSelf: "start" }}
      >
        {showRecipe ? "Hide Recipes" : "Show Recipes"}
      </Button>
    </div>
  );
};

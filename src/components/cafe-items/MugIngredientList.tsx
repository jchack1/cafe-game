import type { SelectedIngredients, OrderItem } from "../../types";

type MugIngredientListProps = {
  item: OrderItem;
  selectedIngredients: SelectedIngredients;
};

export const MugIngredientList = ({
  item,
  selectedIngredients,
}: MugIngredientListProps) => {
  return (
    //* display chosen ingredients as icons*
    <div
      style={{
        height: 36, // reserve space for ingredients so mugs don't jump around when they're added
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Object.entries(selectedIngredients[item.id] ?? {}).length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
            backgroundColor: "pink",
            padding: "4px",
          }}
        >
          {Object.entries(selectedIngredients[item.id]).map(
            ([ingredient, number]) => (
              <div
                key={`chosen-${ingredient}`}
                style={{ position: "relative" }}
              >
                {number}
                <img
                  src={`/images/coffee-items/${ingredient}.svg`}
                  alt={ingredient}
                  width={18}
                  height={18}
                />
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};

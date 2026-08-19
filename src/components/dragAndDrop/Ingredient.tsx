import { useDraggable } from "@dnd-kit/core";
import styled from "styled-components";
import type { Ingredient as IngredientType } from "../../types";

type IngredientComponentProps = {
  ingredient: IngredientType;
};

//explicity give styled component prop type because typescript
//$ prefixed so styled-components keeps them in css instead of forwarding them onto the <img>,
//where height="7vw" would be an invalid html attribute
type IngredientImageProps = {
  $height?: string;
  $minHeight?: string;
};

//sized by height, not width - the artwork has wildly different aspect ratios (the syrup bottle is
//more than twice as tall as it is wide) so matching widths made some ingredients tower over others
export const IngredientImage = styled.img<IngredientImageProps>`
  margin: 10px 10px 2px;
  height: ${(props) => props.$height ?? "7vw"};
  width: auto;

  @media (max-width: 550px) {
    height: ${(props) => props.$minHeight ?? "45px"};
  }
`;

//need to specify size for each ingredient so the items look better on the shelf
export const ingredientHeightMap: Record<string, string> = {
  espresso: "6.5vw",
  drip: "10vw",
  water: "9.5vw",
  milk: "7vw",
  chocolate: "5vw",
  vanillaSyrup: "8vw",
};

export const ingredientMinHeightMap: Record<string, string> = {
  espresso: "40px",
  drip: "67px",
  water: "68px",
  milk: "45px",
  chocolate: "35px",
  vanillaSyrup: "52px",
};

export const Ingredient = ({ ingredient }: IngredientComponentProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ingredient,
    data: {
      type: "ingredient",
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1, //these must be higher than absolutely positioned counter/mugs
      }
    : undefined;

  return (
    <IngredientImage
      src={`../../../images/coffee-items/${ingredient}.svg`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      $height={ingredientHeightMap[ingredient]}
      $minHeight={ingredientMinHeightMap[ingredient]}
    />
  );
};

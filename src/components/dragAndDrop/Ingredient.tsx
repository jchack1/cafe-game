import { useDraggable } from "@dnd-kit/core";
import styled from "styled-components";

type IngredientComponentProps = {
  ingredient: string;
};

//explicity give styled component prop type because typescript
type IngredientImageProps = {
  width?: string;
  minWidth?: string;
};

const IngredientImage = styled.img<IngredientImageProps>`
  margin: 10px 10px 2px;
  width: ${(props) => props.width ?? "100px"};

  @media (max-width: 550px) {
    width: ${(props) => props.minWidth ?? "40px"};
  }
`;

//need to specify size for each ingredient so the items look better on the shelf
const ingredientWidthMap = {
  espresso: "5vw",
  drip: "12vw",
  water: "12vw",
  milk: "10vw",
  chocolate: "8vw",
};

const ingredientMinWidthMap = {
  espresso: "30px",
  drip: "80px",
  water: "90px",
  milk: "60px",
  chocolate: "55px",
};

export const Ingredient = ({ ingredient }: IngredientComponentProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ingredient,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <IngredientImage
      src={`../../../images/coffee-items/${ingredient}.svg`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      width={ingredientWidthMap[ingredient]}
      minWidth={ingredientMinWidthMap[ingredient]}
    />
  );
};

import { useDraggable } from "@dnd-kit/core";
import styled from "styled-components";

type IngredientComponentProps = {
  ingredient: string;
};

const IngredientImage = styled.img`
  margin: 10px;
  width: ${(props) => props.width ?? "100px"};
`;

//need to specify size for each ingredient so the items look better on the shelf
const ingredientWidthMap = {
  espresso: "5vw",
  drip: "12vw",
  water: "12vw",
  milk: "10vw",
  chocolate: "8vw",
};

// const ingredientMinWidthMap = {
//   espresso: "30px",
//   drip: "90px",
//   water: "90px",
//   milk: "70px",
//   chocolate: "55px",
// };

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
    />
  );
};

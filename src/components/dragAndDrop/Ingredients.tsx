import styled from "styled-components";
import { ingredients } from "../../recipes";
import { Ingredient } from "./Ingredient";

const IngredientArea = styled.div`
  display: flex;
`;

export const Ingredients = () => {
  return (
    <IngredientArea>
      {ingredients.map((ingredient) => (
        <Ingredient ingredient={ingredient} />
      ))}
    </IngredientArea>
  );
};

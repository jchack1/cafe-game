import styled from "styled-components";
import { ingredients } from "../../recipes";
import { Ingredient } from "./Ingredient";

const IngredientArea = styled.div`
  display: flex;
  align-items: end;
`;

const Shelf = styled.div`
  width: 100%;
  height: 15px;

  background: #5c2b16;
`;

const IngredientShelfContainer = styled.div`
  width: min-content;
  margin: 0 auto;
`;

export const IngredientShelf = () => {
  return (
    <IngredientShelfContainer>
      <IngredientArea>
        {ingredients.map((ingredient) => (
          <Ingredient ingredient={ingredient} />
        ))}
      </IngredientArea>
      <Shelf />
    </IngredientShelfContainer>
  );
};

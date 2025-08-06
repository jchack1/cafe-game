import styled from "styled-components";
import { useState, useEffect } from "react";
import { ingredients } from "../../recipes";
import { Ingredient } from "./Ingredient";

const IngredientRow = styled.div`
  display: flex;
  align-items: end;
  flex-direction: row;
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
  const [chunkedIngredients, setChunkedIngredients] = useState<string[][]>([
    ingredients,
  ]);

  useEffect(() => {
    const updateChunks = () => {
      if (window.innerWidth <= 425) {
        // chunk into groups on smaller screens
        const chunkSize = 3;
        const chunks = [];

        for (let i = 0; i < ingredients.length; i += chunkSize) {
          chunks.push(ingredients.slice(i, i + chunkSize));
        }
        setChunkedIngredients(chunks);
      } else {
        // one row on large screens, so just one 'chunk'
        setChunkedIngredients([ingredients]);
      }
    };

    updateChunks();
    window.addEventListener("resize", updateChunks);
    return () => window.removeEventListener("resize", updateChunks);
  }, []);

  return (
    <IngredientShelfContainer>
      {/* on small screens, ingredients split into multiple shelves */}
      {chunkedIngredients.map((chunk, index) => (
        <div key={index}>
          <IngredientRow>
            {chunk.map((ingredient) => (
              <Ingredient ingredient={ingredient} />
            ))}
          </IngredientRow>

          <Shelf />
        </div>
      ))}
    </IngredientShelfContainer>
  );
};

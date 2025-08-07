import { recipes } from "../../recipes";
import { useState } from "react";
import styled from "styled-components";

const RecipePage = styled.div`
  width: 200px;
  font-size: 12;
  border: 1px solid #777;
`;

export const RecipeBook = () => {
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState<number>(0);

  return (
    <RecipePage>
      {/* previous */}
      <button
        onClick={() => setCurrentRecipeIndex(currentRecipeIndex - 1)}
        disabled={currentRecipeIndex === 0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="black"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* recipe info */}
      <div>
        <p>{recipes[currentRecipeIndex].name}</p>

        {Object.entries(recipes[currentRecipeIndex].ingredients).map(
          ([ingredient, number]) => (
            <p>
              {number}x {ingredient}
            </p>
          )
        )}
      </div>

      {/* next */}

      <button
        onClick={() => setCurrentRecipeIndex(currentRecipeIndex + 1)}
        disabled={currentRecipeIndex === recipes.length - 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="black"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </RecipePage>
  );
};

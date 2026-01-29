import { recipes } from "../../recipes";
import { useState } from "react";
import styled from "styled-components";
import SmallButton from "../ui/SmallButton";
import { Howl } from "howler";

const RecipePage = styled.div`
  width: 200px;
  font-size: 12;
  border: 1px solid #aaa;
  display: flex;
  justify-content: space-around;
  background: #faf8f5;
  box-shadow: -1px 3px 19px -5px rgba(164, 94, 120, 0.84);

  position: absolute;
  top: 10px;
  right: 10px;

  font-family:
    Indie Flower,
    cursive;
`;

const RecipeTitle = styled.p`
  font-weight: 600;
  font-size: 18px;
`;

const CustomPositionedContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
`;

export const RecipeBook = ({
  setShowRecipe,
}: {
  setShowRecipe: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState<number>(0);

  const turnPageSound = new Howl({
    src: ["soundEffects/turnpage.mp3"],
  });

  return (
    <RecipePage>
      <CustomPositionedContainer>
        <SmallButton onClick={() => setShowRecipe(false)} disabled={false}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </SmallButton>
      </CustomPositionedContainer>

      {/* previous */}
      <SmallButton
        onClick={() => {
          setCurrentRecipeIndex(currentRecipeIndex - 1);
          turnPageSound.play();
        }}
        disabled={currentRecipeIndex === 0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </SmallButton>

      {/* recipe info */}
      <div>
        <RecipeTitle>{recipes[currentRecipeIndex].name}</RecipeTitle>

        {Object.entries(recipes[currentRecipeIndex].ingredients).map(
          ([ingredient, number]) => (
            <p>
              {number} {ingredient}
            </p>
          ),
        )}
      </div>

      {/* next */}

      <SmallButton
        onClick={() => {
          setCurrentRecipeIndex(currentRecipeIndex + 1);
          turnPageSound.play();
        }}
        disabled={currentRecipeIndex === recipes.length - 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </SmallButton>
    </RecipePage>
  );
};

import { recipes } from "../../recipes";
import { useState } from "react";
import styled from "styled-components";
import SmallButton from "../ui/SmallButton";
import { Howl } from "howler";
import { Z_LAYERS } from "../../zLayers";
import { useLevel } from "../../context/LevelContext";

const RecipePage = styled.div`
  width: 80vw;
  max-width: 300px;
  font-size: 14px;
  border: 1px solid #aaa;
  display: flex;
  justify-content: space-around;
  background: #faf8f5;
  box-shadow: -1px 3px 19px -5px rgba(164, 94, 120, 0.84);

  position: absolute;
  top: 50%;
  right: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;

  /* opens over the shelf and the ingredients on it */
  z-index: ${Z_LAYERS.ui};

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

const RecipeLine = styled.p`
  font-size: 16px;
`;

export const RecipeBook = ({
  setShowRecipe,
}: {
  setShowRecipe: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState<number>(0);

  //only show recipes in user's current level
  const { level } = useLevel();

  const recipesToShow = recipes.filter((recipe) => recipe.level <= level);

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

        {Object.entries(recipesToShow[currentRecipeIndex].ingredients).map(
          ([ingredient, number]) => (
            <RecipeLine key={`${number}-${ingredient}`}>
              {number} {ingredient}{" "}
              <img
                src={`/images/coffee-items/${ingredient}.svg`}
                style={{ height: "1em" }}
              />
            </RecipeLine>
          ),
        )}

        <RecipeLine>
          <span style={{ fontWeight: 700 }}>Score:</span>{" "}
          {recipes[currentRecipeIndex].score}
        </RecipeLine>
      </div>

      {/* next */}

      <SmallButton
        onClick={() => {
          setCurrentRecipeIndex(currentRecipeIndex + 1);
          turnPageSound.play();
        }}
        disabled={currentRecipeIndex === recipesToShow.length - 1}
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

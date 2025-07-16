import { useState, useEffect } from "react";
import { recipeMap, ingredients } from "./recipes";
import "./App.css";
import { generateOrder } from "./utils/generateOrder";
import type { Recipe, Order, SelectedIngredients } from "./types";
import { areObjectsEqual } from "./utils/areObjectsEqual";

function App() {
  const [currentOrder, setCurrentOrder] = useState<Order>();
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(); //later on, will have multiple recipes to cycle through, but for now, just show current one
  const [level] = useState(1);
  const [showRecipe, setShowRecipe] = useState(false);
  const [selectedIngredients, setSelectedIngredients] =
    useState<SelectedIngredients>({});

  const handleGetOrder = () => {
    const newOrder = generateOrder(level);

    setCurrentOrder(newOrder);
    setCurrentRecipe(recipeMap[newOrder.items[0]]);
    setSelectedIngredients({});
  };

  const handleSelectIngredient = (ingredient: string) => {
    // console.log(ingredient);
    setSelectedIngredients((prevSelection) => {
      const updatedSelection = { ...prevSelection };

      if (updatedSelection[ingredient]) {
        updatedSelection[ingredient] = updatedSelection[ingredient] + 1;
      } else {
        updatedSelection[ingredient] = 1;
      }

      return updatedSelection;
    });
  };

  const handleCheckOrder = () => {
    if (!currentRecipe || !selectedIngredients) {
      alert("?? ");
      return;
    }
    if (areObjectsEqual(selectedIngredients, currentRecipe.ingredients)) {
      alert("good job!");
      handleGetOrder();
      setSelectedIngredients({});
    } else {
      alert("fail!");
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, []);

  return (
    <>
      {currentRecipe?.name && <h1>{currentRecipe.name}</h1>}

      {showRecipe && currentRecipe && (
        <div>
          <p>Recipe</p>

          {Object.entries(currentRecipe.ingredients).map(
            ([ingredient, number]) => (
              <p>
                {number}x {ingredient}
              </p>
            )
          )}
        </div>
      )}

      <button onClick={() => handleGetOrder()}>Get order</button>
      <button onClick={() => setShowRecipe(!showRecipe)}>
        {showRecipe ? "Hide Recipe" : "Show Recipe"}
      </button>

      <select
        id="ingredients"
        onChange={(e) => {
          handleSelectIngredient(e.target.value);
          e.target.value = "";
        }}
        defaultValue=""
      >
        <option value="" disabled>
          Select ingredient...
        </option>
        {ingredients.map((ingredient) => (
          <option value={ingredient}>{ingredient}</option>
        ))}
      </select>

      {Object.entries(selectedIngredients).map(([ingredient, number]) => (
        <div>
          <span>
            {number} {ingredient}
          </span>
        </div>
      ))}

      <button onClick={() => handleCheckOrder()}>Complete</button>
    </>
  );
}

export default App;

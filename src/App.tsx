//hooks
import { useState, useEffect } from "react";
//components
import { Button } from "./components/ui/Button";
import { Mug } from "./components/dragAndDrop/Mug";
import { Ingredients } from "./components/dragAndDrop/Ingredients";
//helpers/types
import { recipeMap } from "./recipes";
import "./App.css";
import { generateOrder } from "./utils/generateOrder";
import type { Recipe, Order, SelectedIngredients } from "./types";
import { areObjectsEqual } from "./utils/areObjectsEqual";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

/**
 *
 * @todo: major styling work
 */
function App() {
  //state

  const [currentOrder, setCurrentOrder] = useState<Order>();
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(); //later on, will have multiple recipes to cycle through, but for now, just show current one
  const [level] = useState(1);
  const [showRecipe, setShowRecipe] = useState(false);
  const [selectedIngredients, setSelectedIngredients] =
    useState<SelectedIngredients>({});

  // handlers

  const handleGetOrder = () => {
    const newOrder = generateOrder(level);

    setCurrentOrder(newOrder);
    setCurrentRecipe(recipeMap[newOrder.items[0]]);
    setSelectedIngredients({});
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

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over) {
      const currentIngredient = event.active.id;

      setSelectedIngredients((prevSelection) => {
        const updatedSelection = { ...prevSelection };

        if (updatedSelection[currentIngredient]) {
          updatedSelection[currentIngredient] =
            updatedSelection[currentIngredient] + 1;
        } else {
          updatedSelection[currentIngredient] = 1;
        }

        return updatedSelection;
      });
    }
  };

  //get a new order when page loads
  useEffect(() => {
    handleGetOrder();
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* show recipe name */}
        {currentRecipe?.name && <h1>{currentRecipe.name}</h1>}

        {/* if they choose to view it, show ingredients */}
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

        <Button onClick={() => handleGetOrder()}>Get order</Button>
        <Button onClick={() => setShowRecipe(!showRecipe)}>
          {showRecipe ? "Hide Recipe" : "Show Recipe"}
        </Button>

        {/* display chosen ingredients */}
        {Object.entries(selectedIngredients).map(([ingredient, number]) => (
          <div>
            <span>
              {number} {ingredient}
            </span>
          </div>
        ))}

        {/* draggable ingredients fill inside the ingredients area */}
        <Ingredients />

        <Mug id={Math.random() * 10} />

        <Button onClick={() => handleCheckOrder()}>Complete</Button>
      </div>
    </DndContext>
  );
}

export default App;

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
import type { Recipe, Order, SelectedIngredients, OrderItem } from "./types";
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
  // const [currentRecipe, setCurrentRecipe] = useState<Recipe>(); //later on, will have multiple recipes to cycle through, but for now, just show current one
  const [level] = useState(1);
  // const [showRecipe, setShowRecipe] = useState(false);
  const [selectedIngredients, setSelectedIngredients] =
    useState<SelectedIngredients>({});

  // handlers

  const handleGetOrder = () => {
    const newOrder = generateOrder(level);

    setCurrentOrder(newOrder);
    // setCurrentRecipe(recipeMap[newOrder.items[0]]);
    setSelectedIngredients({});
  };

  const handleCheckOrder = () => {
    const orderSuccesses: OrderItem[] = [];
    const orderFails: OrderItem[] = [];

    for (const [orderItemId, selected] of Object.entries(selectedIngredients)) {
      const orderItem = currentOrder?.items.find(
        (item) => item.id === orderItemId
      );

      if (!orderItem) {
        alert("error!");
        return;
      }
      const recipeIngredients = recipeMap[orderItem.recipeId].ingredients;

      if (areObjectsEqual(selected, recipeIngredients)) {
        orderSuccesses.push({
          ...orderItem,
          result: "success!",
        });
      } else {
        orderFails.push({
          ...orderItem,
          result: "fail!",
        });
      }
    }
    if (orderFails.length > 0) {
      setCurrentOrder((prevOrder) => {
        if (!prevOrder) return prevOrder;

        return {
          ...prevOrder,
          items: [...orderSuccesses, ...orderFails],
        };
      });
    } else {
      alert("Success!");
      setSelectedIngredients({});
      handleGetOrder();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over) {
      const orderItemId = event.over.id;
      const currentIngredient = event.active.id;

      setSelectedIngredients((prevSelection) => {
        const updatedSelection = { ...prevSelection };

        //check if we've added ingredients to this order item yet
        const currentOrderItem = updatedSelection[orderItemId];

        //if we haven't, create the order item object in state and add current ingredient
        if (!currentOrderItem) {
          updatedSelection[orderItemId] = {
            [currentIngredient]: 1,
          };
          //if not, find the current item and increment current ingredient
        } else {
          const updatedOrderItem = {
            ...currentOrderItem,
            [currentIngredient]: currentOrderItem[currentIngredient]
              ? currentOrderItem[currentIngredient] + 1
              : 1,
          };

          updatedSelection[orderItemId] = updatedOrderItem;
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
        {/* {currentRecipe?.name && <h1>{currentRecipe.name}</h1>} */}

        {/* if they choose to view it, show ingredients */}
        {/* {showRecipe && currentRecipe && (
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
        )} */}

        <Button onClick={() => handleGetOrder()}>Get order</Button>
        {/* <Button onClick={() => setShowRecipe(!showRecipe)}>
          {showRecipe ? "Hide Recipe" : "Show Recipe"}
        </Button> */}

        {/* draggable ingredients fill inside the ingredients area */}
        <Ingredients />

        <div style={{ display: "flex" }}>
          {/* show mug for each item in order */}
          {currentOrder?.items.map((item) => (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* mug icon */}
                <Mug id={item.id} />

                {/* item name */}
                <p>{recipeMap[item.recipeId].name}</p>

                {/* display chosen ingredients */}

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {selectedIngredients[item.id] &&
                    Object.entries(selectedIngredients[item.id]).map(
                      ([ingredient, number]) => (
                        <div>
                          <span>
                            {number} {ingredient}
                          </span>
                        </div>
                      )
                    )}
                </div>
                <div>{item.result}</div>
              </div>
            </>
          ))}
        </div>
        <Button onClick={() => handleCheckOrder()}>Complete</Button>
      </div>
    </DndContext>
  );
}

export default App;

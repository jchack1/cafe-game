//hooks
import { useState, useEffect } from "react";
//components
import { Button } from "./components/ui/Button";
import { Mug } from "./components/dragAndDrop/Mug";
import { IngredientShelf } from "./components/dragAndDrop/IngredientShelf";
import { Counter } from "./components/cafe-items/Counter";
import { MugInfo } from "./components/ui/containers/MugInfo";
import { CafeWall } from "./components/ui/containers/CafeWall";
import { Text } from "./components/ui/Text";
import { RecipeBook } from "./components/cafe-items/RecipeBook";
//helpers/types
import { recipeMap } from "./recipes";
import { generateOrder } from "./utils/generateOrder";
import type { Order, SelectedIngredients, OrderItem } from "./types";
import { areObjectsEqual } from "./utils/areObjectsEqual";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

/**
 *
 * @todo: major styling work
 */
function App() {
  //state

  const [currentOrder, setCurrentOrder] = useState<Order>();
  // const [currentRecipe, setCurrentRecipe] = useState<Recipe>(); //later on, will have multiple recipes to cycle through, but for now, just show current one
  const [level] = useState(1);
  const [showRecipe, setShowRecipe] = useState(false);
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
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CafeWall>
          <Button
            onClick={() => handleGetOrder()}
            style={{ alignSelf: "start" }}
          >
            Get order
          </Button>
          <Button
            onClick={() => setShowRecipe(!showRecipe)}
            style={{ alignSelf: "start" }}
          >
            {showRecipe ? "Hide Recipes" : "Show Recipes"}
          </Button>

          {showRecipe && <RecipeBook setShowRecipe={setShowRecipe} />}

          {/* draggable ingredients fill inside the ingredients area */}
          <IngredientShelf />

          <Button
            onClick={() => handleCheckOrder()}
            style={{ alignSelf: "start" }}
          >
            Complete
          </Button>
        </CafeWall>

        <Counter>
          {/* show mug for each item in order */}
          {currentOrder?.items.map((item) => (
            <>
              <MugInfo>
                {/* mug icon */}
                <Mug id={item.id} />

                {/* item name */}
                <Text>{recipeMap[item.recipeId].name}</Text>

                {/* display chosen ingredients */}

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {selectedIngredients[item.id] &&
                    Object.entries(selectedIngredients[item.id]).map(
                      ([ingredient, number]) => (
                        <div>
                          <Text>
                            {number} {ingredient}
                          </Text>
                        </div>
                      )
                    )}
                </div>
                <p>{item.result}</p>
              </MugInfo>
            </>
          ))}
        </Counter>
      </div>
    </DndContext>
  );
}

export default App;

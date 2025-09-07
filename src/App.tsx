//hooks
import { useState, useEffect, useRef } from "react";
//components
import { Button } from "./components/ui/Button";
import { Mug } from "./components/dragAndDrop/Mug";
import { IngredientShelf } from "./components/dragAndDrop/IngredientShelf";
import { Counter } from "./components/cafe-items/Counter";
import { MugInfo } from "./components/ui/containers/MugInfo";
import { CafeWall } from "./components/ui/containers/CafeWall";
import { Text } from "./components/ui/Text";
import { RecipeBook } from "./components/cafe-items/RecipeBook";
import { SuccessMessage } from "./components/ui/messages/SuccessMessage";
import { FailMessage } from "./components/ui/messages/FailMessage";
//helpers/types
import { recipeMap } from "./recipes";
import { generateOrder } from "./utils/generateOrder";
import type { Order, SelectedIngredients, OrderItem } from "./types";
import { areObjectsEqual } from "./utils/areObjectsEqual";
import { DndContext } from "@dnd-kit/core";
import type { DragOverEvent, UniqueIdentifier } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Howl } from "howler";
import { motion, AnimatePresence } from "motion/react";
/**
 *
 * @todo: major styling work
 */
function App() {
  //state

  const [currentOrder, setCurrentOrder] = useState<Order>();
  const [level] = useState<number>(1);
  const [showRecipe, setShowRecipe] = useState<boolean>(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [showFailMessage, setShowFailMessage] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string | null>(null);

  const [selectedIngredients, setSelectedIngredients] =
    useState<SelectedIngredients>({});
  const dragIntervalId = useRef<number | null>(null);
  const currentOverId = useRef<UniqueIdentifier | null>(null);

  //sound effects
  const successSound = new Howl({
    src: ["soundEffects/twinkle.mp3"],
  });
  const errorSound = new Howl({
    src: ["soundEffects/error.mp3"],
  });
  // handlers

  const handleGetOrder = () => {
    const newOrder = generateOrder(level);

    setCurrentOrder(newOrder);
    setSelectedIngredients({});
  };

  const handleCheckOrder = () => {
    if (!currentOrder || !currentOrder.items.length) return;

    const orderSuccesses: OrderItem[] = [];
    const orderFails: OrderItem[] = [];

    const selectedIngredientsArr = Object.entries(selectedIngredients);

    //if no ingredients in any cups, fail
    if (selectedIngredientsArr.length === 0) {
      // alert("fail - you didn't make any drinks");
      setShowFailMessage(true);
      setFailMessage("You didn't make any drinks...");

      setTimeout(() => {
        setShowFailMessage(false);
        setFailMessage(null);
      }, 3000);

      errorSound.play();

      return;
    }

    for (const orderItem of currentOrder.items) {
      const orderIngredients = selectedIngredients[orderItem.id];

      //if user didn't put ingredients in the cup, that item is a fail
      if (!orderIngredients) {
        orderFails.push({
          ...orderItem,
          result: `fail! you didn't make the ${
            recipeMap[orderItem.recipeId].name
          }`,
        });
        continue;
      }

      //get required ingredients for this order item, compare what was selected
      const recipeIngredients = recipeMap[orderItem.recipeId].ingredients;

      if (areObjectsEqual(orderIngredients, recipeIngredients)) {
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
        setShowFailMessage(true);
        errorSound.play();

        setTimeout(() => {
          setShowFailMessage(false);
        }, 3000);

        if (!prevOrder) return prevOrder;

        return {
          ...prevOrder,
          items: [...orderSuccesses, ...orderFails],
        };
      });
    } else {
      setShowSuccessMessage(true);
      successSound.play();

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      //reset for next order
      setSelectedIngredients({});
      handleGetOrder();
    }
  };

  //add ingredients into the cup, for as long as that ingredient is hovered over the cup
  //ever X amount of time add one more until they move ingredient away
  const handleDragOver = (event: DragOverEvent) => {
    //keep track of the cup we're currently hovering over
    const overId = event.over?.id ?? null;

    // if we switched cups or dragged away from all cups, clear old interval, and update currentOverId
    if (currentOverId.current !== overId) {
      if (dragIntervalId.current) {
        clearInterval(dragIntervalId.current);
        dragIntervalId.current = null;
      }
      currentOverId.current = overId;
    }

    //if we're over a cup, and there is no interval, start new interval (meaning, start adding ingredients to the cup as long as they're hovered over it)
    if (overId && !dragIntervalId.current) {
      dragIntervalId.current = setInterval(() => {
        const orderItemId = overId;
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
      }, 700);
    }
  };

  //always clear interval whenever we stop dragging
  const handleDragEnd = () => {
    if (dragIntervalId.current) {
      clearInterval(dragIntervalId.current);
      dragIntervalId.current = null;
    }
  };

  //get a new order when page loads
  useEffect(() => {
    handleGetOrder();
  }, []);

  return (
    // <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
    <DndContext
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
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
          {/* animate mugs going off screen on complete, on screen when new order comes in */}
          <AnimatePresence initial={false}>
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              transition={{ duration: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              key={currentOrder?.id ? `mug-div-${currentOrder?.id}` : "mug-div"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {/* show mug for each item in order */}
              {currentOrder?.items.map((item) => (
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
                  <p style={{ color: "#ff9b9bff" }}>{item.result}</p>
                </MugInfo>
              ))}
            </motion.div>
          </AnimatePresence>
        </Counter>
      </div>

      {showSuccessMessage && <SuccessMessage />}
      {showFailMessage && <FailMessage message={failMessage} />}
    </DndContext>
  );
}

export default App;

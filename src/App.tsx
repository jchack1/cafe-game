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
import { TrashCan } from "./components/dragAndDrop/TrashCan";
//helpers/types
import { recipeMap } from "./recipes";
import { generateOrder } from "./utils/generateOrder";
import type { Order, SelectedIngredients, OrderItem } from "./types";
import { areObjectsEqual } from "./utils/areObjectsEqual";
import {
  DndContext,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  DragOverEvent,
  UniqueIdentifier,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Howl } from "howler";
import { motion, AnimatePresence } from "motion/react";
/**
 *
 * @todo: major styling work; re-organize code
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

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 10, tolerance: 5 },
    }),
  );
  //sound effects
  const successSound = new Howl({
    src: ["soundEffects/twinkle.mp3"],
  });
  const errorSound = new Howl({
    src: ["soundEffects/error.mp3"],
  });
  const emptyMugSound = new Howl({
    src: ["soundEffects/liquid-splash.mp3"],
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
  //every X amount of time add one more until they move ingredient away
  const handleDragOver = (event: DragOverEvent) => {
    const overItem = event.over;
    const activeItem = event.active;
    //keep track of the cup/droppable area we're currently hovering over
    const overId = overItem?.id ?? null;
    const activeId = activeItem?.id ?? null;

    const overType = overItem?.data?.current?.type;
    const activeType = activeItem?.data?.current?.type;

    //can't drag item over itself
    if (overId === activeId || overType === activeType) return;

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
      }, 400);
    }
  };

  //always clear interval whenever we stop dragging
  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id ?? null;
    const activeItem = event.active;

    // if mug is dragged over trash area, get rid of ingredients
    // this could be its own function
    if (
      overId === "trash" &&
      activeItem?.data?.current?.type === "mug" &&
      activeItem?.id &&
      selectedIngredients[activeItem.id] &&
      Object.keys(selectedIngredients[activeItem.id]).length > 0
    ) {
      //remove ingredients
      setSelectedIngredients((prev) => {
        const updatedSelection = { ...prev };

        updatedSelection[activeItem.id] = {};

        return updatedSelection;
      });

      //todo: remove fail message, if it exists, from item in order

      emptyMugSound.play();
    }

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
    <DndContext
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
      sensors={sensors}
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
                <MugInfo key={`mug-info-${item.id}`}>
                  {/* mug icon */}
                  <Mug id={item.id} />

                  {/* item name */}
                  <Text>{recipeMap[item.recipeId].name}</Text>

                  {/* display chosen ingredients */}

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {selectedIngredients[item.id] &&
                      Object.entries(selectedIngredients[item.id]).map(
                        ([ingredient, number]) => (
                          <div key={`chosen-${number}-${ingredient}`}>
                            <Text>
                              {number} {ingredient}
                            </Text>
                          </div>
                        ),
                      )}
                  </div>
                  <p style={{ color: "#ff9b9bff" }}>{item.result}</p>
                </MugInfo>
              ))}
            </motion.div>
          </AnimatePresence>
          <TrashCan />
        </Counter>
      </div>

      {showSuccessMessage && <SuccessMessage />}
      {showFailMessage && <FailMessage message={failMessage} />}
    </DndContext>
  );
}

export default App;

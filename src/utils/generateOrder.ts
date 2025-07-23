import type { Order, OrderItem } from "../types";
import { recipes } from "../recipes";
import { v4 as uuidv4 } from "uuid";

//todo: generate more than one item per order. for now, just order one item at a time

export const generateOrder = (level: number): Order => {
  //get a random recipe from recipes file
  const recipesForLevel = recipes.filter((recipe) => recipe.level === level);

  const randomNumberOfItems = Math.floor(Math.random() * 4) + 1;

  const randomItems: OrderItem[] = Array.from(
    { length: randomNumberOfItems },
    () => {
      //get a random number from recipesForLevel - this is the item id number
      return {
        id: uuidv4(),
        recipeId: Math.floor(Math.random() * recipesForLevel.length + 1),
      };
    }
  );

  const newOrder: Order = {
    id: String(Math.random() * 1000000), //get better id string later when we are saving to db or local storage - uuid?
    items: randomItems,
  };

  return newOrder;
};

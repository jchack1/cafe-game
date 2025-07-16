import type { Order } from "../types";
import { recipes } from "../recipes";

//todo: generate more than one item per order. for now, just order one item at a time

export const generateOrder = (level: number): Order => {
  //get a random recipe from recipes file
  const recipesForLevel = recipes.filter((recipe) => recipe.level === level);

  const randomRecipeIndex = Math.floor(Math.random() * recipesForLevel.length);

  const newOrder: Order = {
    id: String(Math.random() * 1000000), //get better id string later when we are saving to db or local storage - uuid?
    items: [randomRecipeIndex],
  };

  return newOrder;
};

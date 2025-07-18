import type { Recipe, Ingredient } from "./types";

export const ingredients: Ingredient[] = [
  "espresso",
  "drip",
  "water",
  "milk",
  "chocolate",
];
//maybe they can order just milk, or just water at some point? would they become their own recipe at that point?

//hardcoded recipes for now
export const recipes: Recipe[] = [
  {
    id: 1,
    name: "espresso",
    ingredients: {
      espresso: 1,
    },
    level: 1,
  },
  {
    id: 2,
    name: "drip",
    ingredients: {
      drip: 1,
    },
    level: 1,
  },
  {
    id: 3,
    name: "americano",
    ingredients: {
      espresso: 1,
      water: 3,
    },
    level: 1,
  },
  {
    id: 4,
    name: "cappucino",
    ingredients: {
      espresso: 1,
      milk: 2,
    },
    level: 1,
  },
  {
    id: 5,
    name: "latte",
    ingredients: {
      espresso: 1,
      milk: 3,
    },
    level: 1,
  },
  {
    id: 6,
    name: "mocha",
    ingredients: {
      espresso: 1,
      milk: 3,
      chocolate: 1,
    },
    level: 1,
  },
  {
    id: 7,
    name: "hot chocolate",
    ingredients: {
      milk: 3,
      chocolate: 1,
    },
    level: 1,
  },
];

//level 2:
//tea drinks: matcha, chai, london fog
//iced versions of above

//level 3:
//alt milks: oat, almond, soy
//extras like cream, sugar, flavor shots
//seasonal: pumpkin spice, peppermint mocha
//smoothies, ades, sodas etc

//create a map to look up recipes by id
//this creates an object from the array; map creates key-value pairs of id (key) and the rest of the recipe object(value)
export const recipeMap = Object.fromEntries(recipes.map((r) => [r.id, r]));

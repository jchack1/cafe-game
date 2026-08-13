import type { Recipe, Ingredient } from "./types";

// export const ingredientsLevel1: Ingredient[] = [
export const ingredients: Ingredient[] = [
  "espresso",
  "drip",
  "water",
  "milk",
  "chocolate",
];

export const ingredientsLevel2: Ingredient[] = [
  "matcha",
  "chai",
  "earlGrey",
  "chamomile",
  "greenTea",
  "vanillaSyrup",
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
    score: 100,
  },
  {
    id: 2,
    name: "drip",
    ingredients: {
      drip: 1,
    },
    level: 1,
    score: 100,
  },
  {
    id: 3,
    name: "americano",
    ingredients: {
      espresso: 1,
      water: 3,
    },
    level: 1,
    score: 120,
  },
  {
    id: 4,
    name: "cappucino",
    ingredients: {
      espresso: 1,
      milk: 2,
    },
    level: 1,
    score: 130,
  },
  {
    id: 5,
    name: "latte",
    ingredients: {
      espresso: 1,
      milk: 3,
    },
    level: 1,
    score: 140,
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
    score: 160,
  },
  {
    id: 7,
    name: "hot chocolate",
    ingredients: {
      milk: 3,
      chocolate: 1,
    },
    level: 1,
    score: 150,
  },
  {
    id: 8,
    name: "cortado",
    ingredients: {
      milk: 1,
      espresso: 1,
    },
    level: 1,
    score: 110,
  },

  //level 2 - matcha, tea, tea lattes

  {
    id: 9,
    name: "matcha",
    ingredients: {
      matcha: 1,
      water: 1,
    },
    level: 2,
    score: 110,
  },
  {
    id: 10,
    name: "matcha latte",
    ingredients: {
      matcha: 1,
      water: 1,
      milk: 3,
    },
    level: 2,
    score: 160,
  },
  {
    id: 11,
    name: "london fog",
    ingredients: {
      earlGrey: 1,
      milk: 3,
      vanillaSyrup: 1,
    },
    level: 2,
    score: 160,
  },
  {
    id: 12,
    name: "chai latte",
    ingredients: {
      chai: 1,
      milk: 3,
    },
    level: 2,
    score: 140,
  },
  {
    id: 13,
    name: "earl grey tea",
    ingredients: {
      earlGrey: 1,
      water: 3,
    },
    level: 2,
    score: 120,
  },
  {
    id: 14,
    name: "chai tea",
    ingredients: {
      chai: 1,
      water: 3,
    },
    level: 2,
    score: 120,
  },
  {
    id: 15,
    name: "green tea",
    ingredients: {
      greenTea: 1,
      water: 3,
    },
    level: 2,
    score: 120,
  },
  {
    id: 16,
    name: "chamomile tea",
    ingredients: {
      chamomile: 1,
      water: 3,
    },
    level: 2,
    score: 120,
  },
];

//level 3:
//alt milks: oat, almond, soy
//extras like cream, sugar, flavor shots
//seasonal: pumpkin spice, peppermint mocha
//smoothies, ades, sodas etc

//create a map to look up recipes by id
//this creates an object from the array; map creates key-value pairs of id (key) and the rest of the recipe object(value)
export const recipeMap = Object.fromEntries(recipes.map((r) => [r.id, r]));

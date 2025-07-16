export type Ingredient = string;

export type SelectedIngredients = {
  [ingredient: Ingredient]: number;
};

export type Recipe = {
  id: number;
  name: string;
  ingredients: {
    [ingredient: Ingredient]: number;
  };
  level: number; //earlier in the game, only pull low level recipes
};

export type Order = {
  id: string; //uuid
  items: number[]; //recipe numbers - all items to make
};

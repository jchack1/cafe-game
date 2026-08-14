export type Ingredient = string;

export type CupIngredients = {
  [ingredient: string]: number;
};

export type SelectedIngredients = {
  [orderItemId: string]: CupIngredients;
};

export type Recipe = {
  id: number;
  name: string;
  ingredients: {
    [ingredient: string]: number;
  };
  level: number; //earlier in the game, only pull low level recipes
  score: number;
  cupName: string;
};

export type OrderItem = {
  id: string;
  recipeId: number;
  result: null | string;
};

export type Order = {
  id: string; //uuid
  items: OrderItem[]; //recipe numbers - all items to make
};

export type ScoreBreakdownItem = {
  label: string;
  value: number;
};

export type RoundScoreResult = {
  items: ScoreBreakdownItem[];
  previousTotal: number;
  newTotal: number;
};

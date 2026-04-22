import { useState, useRef } from "react";
import { recipes } from "../recipes";
import type { Order, OrderItem, Recipe } from "../types";

//constants
const INGREDIENT_DISCARD_DEDUCTION = 100;
const INCORRECT_DRINK_DEDUCTION = 25;

/**
 *
 * Holds all scoring logic
 */
export const useScore = () => {
  const [currentRoundScore, setCurrentRoundScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  //   const [previousScore, setPreviousScore] = useState<number>(0); //save in local storage, fetch on load
  const [ingredientDiscardCount, setIngredientDiscardCount] =
    useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0); //number of drinks they get wrong during round
  const startTimeRef = useRef<number | null>(null); //when they started the order

  //fetch previous score on load - for display
  // useEffect(() => {

  // }, [])

  //what do we need to get a score?
  //expose some functions that update the score in real time?
  //add scores to recipes? and import recipes so we can add up those totals

  //once complete, add current score to total score, and reset current score
  const updateTotalScore = (order: Order) => {
    if (!order) {
      console.log("no order passed to scoring hook");
      return;
    }

    //stop timer
    let timeToComplete;

    if (startTimeRef.current) {
      timeToComplete = (Date.now() - startTimeRef.current) / 1000; //time in seconds
    } else {
      console.log("no timeToComplete - startTimeRef.current === null");
    }

    //1. get base score based on ingredient items
    const baseScore = calculateOrderScore(order.items, recipes);

    //2. get time bonus
    const timeBonus = timeToComplete
      ? calculateTimeBonus(order.items.length, timeToComplete)
      : 0;

    //3. get deduction for ingredient discard
    const ingredientDiscardDeduction =
      ingredientDiscardCount * INGREDIENT_DISCARD_DEDUCTION;

    //4. get deduction for incorrect drink count
    const incorrectDeduction = incorrectCount * INCORRECT_DRINK_DEDUCTION;

    //5. sum scores
    const roundTotal =
      baseScore + timeBonus - ingredientDiscardDeduction - incorrectDeduction;

    //6. update round and total scores
    setCurrentRoundScore(roundTotal);
    setTotalScore((prev) => prev + roundTotal);
  };

  //deduct points from current score when they throw away ingredients
  //don't let score go below 0
  const incrementIngredientDiscardCount = () => {
    setIngredientDiscardCount((prev) => prev + 1);
  };

  const incrementIncorrectCount = () => {
    setIncorrectCount((prev) => prev + 1);
  };

  //depending on how long they take to finish, give bonus
  //also depends on number of drinks - more drinks === higher bonus
  const calculateTimeBonus = (numItems: number, timeToComplete: number) => {
    let timePoints;

    if (timeToComplete <= 5) {
      timePoints = 300;
    } else if (timeToComplete <= 10) {
      timePoints = 200;
    } else if (timeToComplete <= 15) {
      timePoints = 50;
    } else if (timeToComplete <= 20) {
      timePoints = 25;
    } else {
      timePoints = 0;
    }

    return timePoints * numItems;
  };

  //add up scores for all drinks
  const calculateOrderScore = (items: OrderItem[], recipes: Recipe[]) => {
    const sumItemScores = items.reduce((acc, item) => {
      const currentItemRecipe = recipes.find(
        (recipe) => recipe.id === item.recipeId,
      );
      let currentItemRecipeScore = 0;

      if (currentItemRecipe) {
        currentItemRecipeScore = currentItemRecipe.score;
      }

      return acc + currentItemRecipeScore;
    }, 0);

    return sumItemScores * (1 + 0.1 * items.length); //bigger score if more drinks
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
  };

  return {
    updateTotalScore,
    startTimer,
    incrementIngredientDiscardCount,
    incrementIncorrectCount,
    totalScore,
    currentRoundScore,
  };
};

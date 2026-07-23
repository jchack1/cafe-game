import { useState, useRef } from "react";
import { recipes } from "../recipes";
import type { Order, OrderItem, Recipe, RoundScoreResult } from "../types";

//constants
const INGREDIENT_DISCARD_DEDUCTION = 25;
const INCORRECT_DRINK_DEDUCTION = 50;

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
  const [roundResult, setRoundResult] = useState<RoundScoreResult | null>(null); //breakdown of the last completed round, for the score animation
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

    console.log("-----");

    //1. get base score based on ingredient items
    const baseScore = calculateOrderScore(order.items, recipes);

    console.log("baseScore");
    console.log(baseScore);

    //2. get time bonus
    const timeBonus = timeToComplete
      ? calculateTimeBonus(order.items.length, timeToComplete)
      : 0;

    console.log("timeBonus");
    console.log(timeBonus);

    //3. get deduction for ingredient discard
    const ingredientDiscardDeduction =
      ingredientDiscardCount * INGREDIENT_DISCARD_DEDUCTION;

    console.log("ingredientDiscardDeduction");
    console.log(ingredientDiscardDeduction);

    //4. get deduction for incorrect drink count
    const incorrectDeduction = incorrectCount * INCORRECT_DRINK_DEDUCTION;

    console.log("incorrectDeduction");
    console.log(incorrectDeduction);

    //5. sum scores
    const roundTotal =
      baseScore + timeBonus - ingredientDiscardDeduction - incorrectDeduction;

    console.log("roundTotal");
    console.log(roundTotal);

    //6. build breakdown for the score animation, dropping anything that didn't apply this round
    const items = [
      { label: "drinks", value: baseScore },
      { label: "speed bonus", value: timeBonus },
      { label: "spilled ingredients", value: -ingredientDiscardDeduction },
      { label: "wrong drinks", value: -incorrectDeduction },
    ].filter((item) => item.value !== 0);

    //7. update round and total scores
    setCurrentRoundScore(roundTotal);

    const newTotal = totalScore + roundTotal;
    setRoundResult({ items, previousTotal: totalScore, newTotal });

    setTotalScore(newTotal);

    resetScoreState();
  };

  const clearRoundResult = () => {
    setRoundResult(null);
  };

  //deduct points from current score when they throw away ingredients (per ingredient)
  const incrementIngredientDiscardCount = (wastedIngredients: number) => {
    setIngredientDiscardCount((prev) => prev + wastedIngredients);
  };

  //deduct number of incorrect drinks when they submit an order (if any)
  const incrementIncorrectCount = (failCount: number) => {
    setIncorrectCount((prev) => prev + failCount);
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

    return Math.round(sumItemScores * (1 + 0.1 * items.length)); //bigger score if more drinks
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
  };

  const resetScoreState = () => {
    setCurrentRoundScore(0);
    setIncorrectCount(0);
    setIngredientDiscardCount(0);
  };

  return {
    updateTotalScore,
    startTimer,
    incrementIngredientDiscardCount,
    incrementIncorrectCount,
    totalScore,
    currentRoundScore,
    resetScoreState,
    roundResult,
    clearRoundResult,
  };
};

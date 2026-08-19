import styled from "styled-components";
import { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { ingredientMap } from "../../recipes";
import {
  Ingredient,
  IngredientImage,
  ingredientHeightMap,
  ingredientMinHeightMap,
} from "./Ingredient";
import type { Ingredient as IngredientType } from "../../types";
import { Z_LAYERS } from "../../zLayers";
import SmallButton from "../ui/SmallButton";
import { useLevel } from "../../context/LevelContext";

//how many shelves fit on the wall at once - the rest are paged through with the arrows
const SHELVES_PER_PAGE = 2;

const IngredientRow = styled.div`
  display: flex;
  align-items: end;
  justify-content: center;
  flex-direction: row;
`;
const Shelf = styled.div`
  width: 100%;
  height: 15px;

  background: #5c2b16;
`;

//lifted onto the ingredient layer so the shelf and its draggables always paint in front of the
//background props - the counter clutter rises up into this same band of the wall
const IngredientShelfContainer = styled.div`
  width: 100%;
  margin: auto 0;
  align-self: center;

  display: flex;
  flex-direction: row;
  align-items: center;

  position: relative;
  z-index: ${Z_LAYERS.ingredient};
`;

//the shelves take whatever width is left once the arrows have their space, so they can never
//overflow the page - ingredients that don't fit move onto the next shelf/page instead
const ShelfArea = styled.div`
  flex: 1;
  min-width: 0;
`;

//offscreen copy of every ingredient, only used to measure how wide each one renders
const MeasureRow = styled.div`
  display: flex;
  flex-wrap: nowrap;

  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  pointer-events: none;
`;

export const IngredientShelf = () => {
  const [pages, setPages] = useState<IngredientType[][][]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  //ingredients are sized by height, so their width isn't known until the svg's aspect ratio is
  //loaded - re-measure as they come in
  const [loadedCount, setLoadedCount] = useState<number>(0);

  const shelfAreaRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const { level } = useLevel();
  console.log("level ingredient shelf");
  console.log(level);

  const includedIngredients: IngredientType[] = useMemo(
    () =>
      Object.entries(ingredientMap)
        .map(([ingredientLevel, ingredientArr]) =>
          Number(ingredientLevel) <= level ? ingredientArr : [],
        )
        .flat()
        .filter(Boolean),
    [level],
  );

  useLayoutEffect(() => {
    const layoutShelves = () => {
      const shelfArea = shelfAreaRef.current;
      const measureRow = measureRef.current;
      if (!shelfArea || !measureRow) return;

      const availableWidth = shelfArea.clientWidth;

      //ingredient widths are in vw, so they have to be measured rather than assumed
      const widths = Array.from(measureRow.children).map((child) => {
        const element = child as HTMLElement;
        const { marginLeft, marginRight } = window.getComputedStyle(element);

        return (
          element.offsetWidth + parseFloat(marginLeft) + parseFloat(marginRight)
        );
      });

      //pack ingredients onto shelves the way a wrapping row would break them
      const shelves: IngredientType[][] = [];
      let currentShelf: IngredientType[] = [];
      let currentWidth = 0;

      includedIngredients.forEach((ingredient, index) => {
        const width = widths[index] ?? 0;

        if (currentShelf.length > 0 && currentWidth + width > availableWidth) {
          shelves.push(currentShelf);
          currentShelf = [];
          currentWidth = 0;
        }

        currentShelf.push(ingredient);
        currentWidth += width;
      });

      if (currentShelf.length > 0) shelves.push(currentShelf);

      const nextPages: IngredientType[][][] = [];
      for (let i = 0; i < shelves.length; i += SHELVES_PER_PAGE) {
        nextPages.push(shelves.slice(i, i + SHELVES_PER_PAGE));
      }

      setPages(nextPages);
    };

    layoutShelves();
    window.addEventListener("resize", layoutShelves);
    return () => window.removeEventListener("resize", layoutShelves);
  }, [includedIngredients, loadedCount]);

  //keep the page in range when the shelves get re-packed
  useEffect(() => {
    if (currentPage > pages.length - 1) {
      setCurrentPage(Math.max(0, pages.length - 1));
    }
  }, [pages, currentPage]);

  const shelvesToShow = pages[currentPage] ?? [];

  return (
    <IngredientShelfContainer>
      <MeasureRow ref={measureRef} aria-hidden>
        {includedIngredients.map((ingredient) => (
          <IngredientImage
            key={ingredient}
            src={`../../../images/coffee-items/${ingredient}.svg`}
            $height={ingredientHeightMap[ingredient]}
            $minHeight={ingredientMinHeightMap[ingredient]}
            onLoad={() => setLoadedCount((count) => count + 1)}
          />
        ))}
      </MeasureRow>

      {/* both arrows always render so the shelves keep a steady width - they just fade out
          when there's nothing to page to */}
      <SmallButton
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </SmallButton>

      <ShelfArea ref={shelfAreaRef}>
        {shelvesToShow.map((shelf, index) => (
          <div key={index}>
            <IngredientRow>
              {shelf.map((ingredient) => (
                <Ingredient ingredient={ingredient} key={ingredient} />
              ))}
            </IngredientRow>

            <Shelf />
          </div>
        ))}
      </ShelfArea>

      <SmallButton
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= pages.length - 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </SmallButton>
    </IngredientShelfContainer>
  );
};

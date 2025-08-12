//a container to hold background image, ingredients, ingredient shelf, and recipes
//needed to help divide page into two main areas, wall and counter, and help push the counter to the bottom of the page
import styled from "styled-components";

export const CafeWall = styled.div`
  width: 100vw;
  height: 60vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: #fce5ee;
  opacity: 1;
  background-image: radial-gradient(#fb7fb3 1.25px, #fce5ee 1.25px);
  background-size: 25px 25px;

  position: relative;
`;

// helpful site for simple css backgrounds:
// https://www.magicpattern.design/tools/css-backgrounds

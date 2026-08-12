//a container to hold background image, ingredients, ingredient shelf, and recipes
//needed to help divide page into two main areas, wall and counter, and help push the counter to the bottom of the page
import styled from "styled-components";

export const CafeWall = styled.div`
  width: 100vw;
  height: 50vh;

  display: flex;
  flex-direction: column;

  background-color: #8d6574ff;
  opacity: 1;

  background-image: radial-gradient(#744a5aff 1.25px, #9f7b89ff 1.25px);
  background-size: 25px 25px;

  position: relative;
`;

// helpful site for simple css backgrounds:
// https://www.magicpattern.design/tools/css-backgrounds

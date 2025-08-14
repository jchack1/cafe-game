//a container to hold background image, ingredients, ingredient shelf, and recipes
//needed to help divide page into two main areas, wall and counter, and help push the counter to the bottom of the page
import styled from "styled-components";

export const CafeWall = styled.div`
  width: 100vw;
  height: 60vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // background-color: #fce5ee; //original background colour
  background-color: #8d6574ff;
  opacity: 1;
  // background-image: radial-gradient(#fb7fb3 1.25px, #fce5ee 1.25px); //original colour
  // background-image: radial-gradient(#623848ff 1.25px, #8d6574ff 1.25px);
  background-image: radial-gradient(
    #744a5aff 1.25px,
    #9f7b89ff 1.25px
  ); //darker so success message would show up better, but not sure I like it
  background-size: 25px 25px;

  position: relative;
`;

// helpful site for simple css backgrounds:
// https://www.magicpattern.design/tools/css-backgrounds

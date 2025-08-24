//this component is where the mugs are placed
import styled from "styled-components";

//mugs positioned relative to counter so they animate across the screen properly - had issue with them showing up initially at the bottom of the screen, then jumping up once initial animation complete.
const CounterBackground = styled.div`
  width: 100vw;
  height: 40vh;
  margin: 0;
  overflow-x: hidden;

  background-image: url("../../../images/background-items/Wood-Grain.JPG");
  background-size: cover;
  background-repeat: no-repeat;

  position: relative;
`;

export const Counter = ({ children }) => {
  return <CounterBackground>{children}</CounterBackground>;
};

//this component is where the mugs are placed
import styled from "styled-components";

const CounterBackground = styled.div`
  width: 100vw;
  height: 40vh;
  margin: 0;
  overflow-x: hidden;

  background-image: url("../../../images/background-items/Wood-Grain.JPG");
  background-size: cover;
  background-repeat: no-repeat;
`;

export const Counter = ({ children }) => {
  return <CounterBackground>{children}</CounterBackground>;
};

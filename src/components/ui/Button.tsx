import styled from "styled-components";

export const Button = styled.button`
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: white;

  background-image: linear-gradient(
    to right,
    #d3959b 0%,
    #6dab64 51%,
    #d3959b 100%
  );

  margin: 10px;

  text-align: center;
  text-transform: uppercase;

  transition: 0.5s;

  background-size: 200% auto;

  box-shadow: 0 0 20px #eee;
  border-radius: 10px;

  display: block;

  outline: none;
  border: none;

  cursor: pointer; /* nice addition */

  &:hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }
`;

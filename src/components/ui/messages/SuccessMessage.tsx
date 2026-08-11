import styled from "styled-components";
import { Sparkles } from "./Sparkles";

const SuccessText = styled.p`
  font-size: 60px;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 7px #580286ff;
  font-family:
    Indie Flower,
    cursive;
  text-align: center;
`;

const messages: string[] = [
  "Success!",
  "You did it!",
  "Wow!",
  "Nice!",
  "Good job!",
  "Ok!",
  "Yay!",
  "I'm proud of you.",
  "Delicious!",
  "This is the best coffee shop!",
];

export const SuccessMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.length);

  return (
    <div className="success-message-container">
      <Sparkles />
      <SuccessText>{messages[randomIndex]}</SuccessText>
    </div>
  );
};

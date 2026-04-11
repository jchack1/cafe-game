import { useEffect, useState } from "react";
import styled from "styled-components";

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: self-end;

  position: absolute;
  top: 50%;
  right: 10px;

  svg {
    width: 30px;
    height: 30px;
  }

  path {
    fill: #ecbcc1;
    opacity: 40%;
    animation: mymove 5s infinite;
  }

  @keyframes mymove {
    50% {
      opacity: 80%;
    }
  }
`;

const MessageText = styled.p`
  color: #ecbcc1;
  font-size: 12px;
  opacity: 40%;
  width: min-content;
  font-style: italic;
  animation: mymove 5s infinite;
`;

/**
 * Icon/message that tells touch screen user which way to swipe to complete a round
 *
 * @returns {JSX.Element}
 */
export const SwipeRightIcon = () => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(false);
    }, 8000);
  }, []);

  return (
    <IconContainer>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M535.1 342.6C547.6 330.1 547.6 309.8 535.1 297.3L375.1 137.3C362.6 124.8 342.3 124.8 329.8 137.3C317.3 149.8 317.3 170.1 329.8 182.6L467.2 320L329.9 457.4C317.4 469.9 317.4 490.2 329.9 502.7C342.4 515.2 362.7 515.2 375.2 502.7L535.2 342.7zM183.1 502.6L343.1 342.6C355.6 330.1 355.6 309.8 343.1 297.3L183.1 137.3C170.6 124.8 150.3 124.8 137.8 137.3C125.3 149.8 125.3 170.1 137.8 182.6L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7z" />
      </svg>
      {showMessage && <MessageText>swipe to complete</MessageText>}
    </IconContainer>
  );
};

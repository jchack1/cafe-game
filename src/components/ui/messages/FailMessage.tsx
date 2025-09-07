import styled from "styled-components";

const FailText = styled.p`
  font-size: 60px;
  font-weight: 700;
  color: #ffe0e0ff;
  text-shadow: 2px 2px 7px #750213ff;
  font-family: Indie Flower, cursive;
  text-align: center;
`;

const MessageContainer = styled.div`
  transform: translate(-50%, -50%);
  position: absolute;
  display: inline-block;
  top: 50%;
  left: 50%;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;

const messages: string[] = [
  "Fail",
  "Incorrect",
  "No",
  "Wrong",
  "Uhh...",
  "Can I speak to your manager?",
];

//if message included, display that, otherwise randomly choose a preset message
export const FailMessage = ({ message = null }) => {
  const randomIndex = Math.floor(Math.random() * messages.length);

  return (
    <MessageContainer className="fail-message-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18 18 6M6 6l12 12"
          stroke="red"
        />
      </svg>

      <FailText>{message ?? messages[randomIndex]}</FailText>
    </MessageContainer>
  );
};

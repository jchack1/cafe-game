import styled from "styled-components";
import type { ReactNode } from "react";

type SmallButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const IconButton = styled.button`
  padding: 10px;
  background: none;
  color: #777;
  border: none;

  &:hover {
    cursor: ${(props) => (props.disabled ? "inherit" : "pointer")};
  }

  svg {
    width: 20px;
    stroke: #555;
    opacity: ${(props) => (props.disabled ? 0 : 1)};

    &:hover {
      stroke: black;
      opacity: ${(props) => (props.disabled ? 0 : 1)};
    }
  }
`;

const SmallButton = ({ children, onClick, disabled }: SmallButtonProps) => {
  return (
    <IconButton onClick={onClick} disabled={disabled}>
      {children}
    </IconButton>
  );
};

export default SmallButton;

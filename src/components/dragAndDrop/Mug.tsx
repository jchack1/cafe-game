import { useDroppable } from "@dnd-kit/core";
import styled from "styled-components";

const MugImage = styled.img`
  margin: 10px;
  width: 200px;

  @media (max-width: 900px) {
    width: 120px;
  }

  @media (max-width: 500px) {
    width: 90px;
  }
`;

//import id since there could be multiple mugs on screen, id is assigned in Order
export const Mug = ({ id }: { id: string }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  //mug area to drop ingredients
  return (
    <MugImage src="../../../images/coffee-items/mug.svg" ref={setNodeRef} />
  );
};

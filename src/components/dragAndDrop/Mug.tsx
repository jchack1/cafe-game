import { useDroppable, useDraggable } from "@dnd-kit/core";
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
  const { setNodeRef: setDropRef } = useDroppable({
    id,
    data: {
      accepts: "ingredient",
      type: "mug",
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id,
    data: {
      type: "mug",
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1, //these must be higher than absolutely positioned counter/mugs
      }
    : undefined;

  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  //mug area to drop ingredients
  return (
    <MugImage
      src="../../../images/coffee-items/mug.svg"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    />
  );
};

import { useDroppable, useDraggable } from "@dnd-kit/core";
import styled from "styled-components";

const MugImage = styled.img<{ cupName?: string }>`
  margin: 10px;
  width: ${(props) =>
    props.cupName === "Espresso-Cup"
      ? "120px"
      : props.cupName === "Tea-Cup" || props.cupName === "Matcha-Cup"
        ? "150px"
        : "200px"};

  @media (max-width: 900px) {
    width: ${(props) =>
      props.cupName === "Espresso-Cup"
        ? "80px"
        : props.cupName === "Tea-Cup" || props.cupName === "Matcha-Cup"
          ? "100px"
          : "120px"};
  }

  @media (max-width: 500px), (max-height: 600px) {
    width: ${(props) =>
      props.cupName === "Espresso-Cup"
        ? "60px"
        : props.cupName === "Tea-Cup" || props.cupName === "Matcha-Cup"
          ? "70px"
          : "90px"};
  }
`;

//import id since there could be multiple mugs on screen, id is assigned in Order
export const Mug = ({ id, cupName }: { id: string; cupName: string }) => {
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
  console.log(cupName);
  //mug area to drop ingredients
  return (
    <MugImage
      src={`../../../images/mugs/${cupName ?? "mug"}.svg`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      cupName={cupName ?? "mug"}
    />
  );
};

import { useDroppable } from "@dnd-kit/core";
import { Image } from "./Image";

//import id since there could be multiple mugs on screen, id is assigned in Order
export const Mug = ({ id }: { id: string }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  //mug area to drop ingredients
  return <Image src="../../../images/coffee-items/mug.svg" ref={setNodeRef} />;
};

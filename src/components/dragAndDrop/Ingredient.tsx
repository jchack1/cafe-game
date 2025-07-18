import { useDraggable } from "@dnd-kit/core";
import { Image } from "./Image";

type IngredientProps = {
  ingredient: string;
};

export const Ingredient = ({ ingredient }: IngredientProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ingredient,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Image
      src={`../../../svgs/${ingredient}.svg`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    />
  );
};

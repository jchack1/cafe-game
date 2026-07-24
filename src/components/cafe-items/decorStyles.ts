//shared look for the non-interactive background props (wall clutter, mug stacks, plants).
//they all use the same illustrator assets as the draggable ingredients, so without this they compete
//with the shelf for attention. knocking the saturation down and warming them slightly toward the
//mauve wall makes them settle into the background.
export const MUTED_DECOR_FILTER =
  "saturate(0.3) brightness(0.92) contrast(0.95) sepia(0.14)";

//a touch of transparency lets the wall's dot pattern read faintly through the props, which helps
//them sit "in" the scene - kept high enough that the props still look solid
export const MUTED_DECOR_OPACITY = 0.88;

//painting order for the whole scene.
//
//the cafe wall and the counter are both `position: relative` with no z-index of their own, so neither
//creates a stacking context - every value below competes in the same (root) stacking context and can be
//compared directly. that's what lets a prop inside the counter be layered against the shelf inside the
//wall. don't give CafeWall or Counter a z-index, or these comparisons stop working.
//
//anything with its own internal layering (the counter clutter, the dragged items) sits inside a wrapper
//pinned to one of these levels, so its private z-indexes stay contained instead of leaking out here.
export const Z_LAYERS = {
  //background props: hanging plants, mug stack, the clutter along the counter. these are positioned
  //children of the wall/counter so they still paint above those backgrounds, but below anything the
  //player touches.
  decor: 0,
  //order mugs resting on the counter
  mug: 2,
  //draggable ingredients and the shelf they sit on - in front of everything except the ui
  ingredient: 3,
  //buttons, score, recipe book, trash
  ui: 4,
  //the big success/fail text that flashes over the middle of the screen - always the topmost thing
  message: 5,
};

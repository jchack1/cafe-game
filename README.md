### Cafe game

Made with react, typescript and vite.

You just make drinks. It's in the initial stages, mostly just logic without pretty styling. Drag and drop ingredients into a cup.

TO-DOs:

- style game area, refactor as I add more components
  - make styled components instead of having so many divs with inline flexbox styling
- add prop to ingredient or image component to individually set width/height for specific ingredients - relative sizes look off it all set to the same width/height
- create background images: cafe background, counter, etc
- nicer recipe area that includes all recipes - button to toggle through them all
- handle fail scenario - do we get rid of the ingredients? get a new order or let player try again?
  - throw away the ingredients - need a "clear" button of some kind
- fix bug: if one order item is correct, but the rest have not had any ingredients added, round is successful - however, order items without any ingredients should be a fail
- prevent overflow if ingredient dragged off-screen - shouldn't be able to move out of the viewport
- move these to-dos to "project" board in github

Future TO-DOs:

- points system
  - how to calculate and save
  - do we need a backend or is localStorage enough?
- how to handle increasing difficulty and levels?
- more drinks in one order as difficulty increases
- different types of drinks? more ingredients
- music/sound effects

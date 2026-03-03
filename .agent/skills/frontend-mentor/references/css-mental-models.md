# CSS Mental Models

## 1. The Box Model
Think of every HTML element as a recursive data structure (a nested box).
- **Content**: The actual text or image.
- **Padding**: Internal spacing (inside the border).
- **Border**: The edge of the box.
- **Margin**: External spacing (outside the border).

*Backend Analogy*: Think of it like a serialized object with internal "buffer" space (padding) and external "offset" (margin).

## 2. Flexbox (One-Dimensional Layout)
Used for a row **or** a column.
- **Flex Container**: The parent.
- **Flex Items**: The children.
- **Main Axis**: Default is horizontal. Control alignment with `justify-content`.
- **Cross Axis**: Default is vertical. Control alignment with `align-items`.

*Backend Analogy*: Like a `List` or `Array` that you want to distribute across a fixed width/height.

## 3. Grid (Two-Dimensional Layout)
Used for complex layouts (rows **and** columns).
- Define a blueprint: `grid-template-columns: 1fr 2fr;`.
- Place items into "slots".

*Backend Analogy*: Like a 2D Matrix or a Table structure where you define the schema upfront.

## 4. Specificity & Cascading
CSS is not imperative; it's a priority-based rule system.
- Rules are merged based on "specificity" (ID > Class > Tag).
- Ties are broken by the order of declaration (the "Cascade").

*Backend Analogy*: Similar to how log levels or configuration overrides work (e.g., local config overrides global config).

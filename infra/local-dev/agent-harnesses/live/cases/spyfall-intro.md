# Intent: Spyfall intro scrollytelling

**Goal:** The standalone Spyfall Arena intro loads and renders its interactive
experience.

## Steps
1. Navigate to `/spyfall-arena.html`.
2. Confirm the page title contains "Spyfall Arena".
3. Confirm the React root (`#root`) mounts and renders visible content.
4. Scroll through the experience and confirm content reveals as you progress
   (no blank screen, no thrown errors in the console).

## Pass criteria
The page boots, mounts, and progressively reveals content while scrolling.

> Durable expectations discovered here belong in
> [`../../deterministic/spyfall.spec.ts`](../../deterministic/spyfall.spec.ts).

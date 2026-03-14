## Relevant Files

- `src/utils/walkabilityMask.ts` - **New file.** Will contain all canvas-based logic to load and sample the walkability mask PNG.
- `src/components/Game.tsx` - Contains the `canMoveTo()` function (line 121) that will be wired up to the new mask sampler. Also the top-level game loop that needs a `maskReady` guard.
- `src/data/gameObjects.ts` - Contains the existing AABB `checkCollision()` which will be **retained for interactable objects** (houses, Town Hall) but removed as the movement gate.
- `public/walkability_mask.png` - The mask image that already exists (white = walkable, black = blocked, same size as `game_map_large_0.png`: 2048×1342).
- `src/config/gameConfig.ts` - May need a new `WALKABILITY_CONFIG` section for mask path and sample radius.

### Notes

- The walkability mask (`public/walkability_mask.png`) already exists. **Do not regenerate it.**
- The AABB `checkCollision()` function must **not** be removed — it is still used for `checkProximity()` and interaction detection. Only its role as a movement gate is replaced.
- Sample the mask at **all four corners** of the player's hitbox, not just the centre, to avoid clipping through narrow obstacles.
- Because the canvas ImageData is loaded asynchronously, `canMoveTo()` must degrade gracefully (allow movement) while the mask is loading.
- The mask is the **same pixel dimensions** as the map (2048×1342), so no coordinate scaling is needed.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 `git checkout -b feature/pathfinding-overhaul`

- [x] 1.0 Create `walkabilityMask.ts` utility
  - [x] 1.1 Create `src/utils/walkabilityMask.ts`. Export a `WalkabilityMask` class (or module-level singleton) with:
    - `load(src: string): Promise<void>` — draws the mask image into an off-screen `HTMLCanvasElement` and stores the `ImageData`.
    - `isWalkable(x: number, y: number): boolean` — returns `true` if the pixel at `(x, y)` is closer to white than black (threshold: red channel ≥ 128). Returns `true` if mask isn't loaded yet (fail-open).
    - `isReady(): boolean` — returns whether the mask has been loaded.
  - [x] 1.2 Export a pre-instantiated singleton `walkabilityMask` from the same file so callers never need to `new` it.

- [x] 2.0 Wire the mask into `Game.tsx`
  - [x] 2.1 In `Game.tsx`, import `walkabilityMask` from `../utils/walkabilityMask`.
  - [x] 2.2 Add a `useEffect` that calls `walkabilityMask.load('/walkability_mask.png')` once on mount. No state variable needed — `isReady()` handles the guard.
  - [x] 2.3 Rewrite `canMoveTo(newX, newY)` to sample the **four corners** of the player's hitbox against the mask instead of calling `checkCollision()`.
  - [x] 2.4 Keep the map-boundary guard at the top of `canMoveTo()`.
  - [x] 2.5 Ensure `checkCollision` / `checkProximity` imports are **not removed** since they are still used for interaction detection.

- [x] 3.0 Clean up `gameObjects.ts` (optional, non-breaking)
  - [x] 3.1 Add a JSDoc comment to `checkCollision()` clarifying its new role: **interaction/proximity only, not movement gating**.
  - [ ] 3.2 Optionally remove obstacle entries (trees, bushes, rocks) from `allCollidableObjects` that were only there for AABB movement blocking and serve no interaction purpose. Keep houses, Town Hall, and empty lands.

- [ ] 4.0 Verify and commit
  - [ ] 4.1 Run the dev server and manually walk the player into previously un-blocked areas (ocean edge, building walls) and confirm they are now blocked.
  - [ ] 4.2 Confirm player can freely walk on all path/road pixels.
  - [ ] 4.3 Confirm houses, Town Hall interaction prompts still appear when near them.
  - [ ] 4.4 `git add . && git commit -m "fix(pathfinding): replace AABB collision with walkability mask"`.
  - [ ] 4.5 Merge `feature/pathfinding-overhaul` → `main` and push to GitHub.

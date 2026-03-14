## Relevant Files

- `src/contexts/GameContext.tsx` - Contains context state and dispatch for player info, currently causing race conditions.
- `src/components/IntroScreen.tsx` - Handles the character selection and name input, submitting them to the context.
- `src/components/AvatarCarousel.tsx` - Manages visual selection of the avatar and passes the ID to `IntroScreen.tsx`.
- `src/store/slices/teammatesSlice.ts` - Stores the player's name, avatar ID, and avatar level.
- `src/components/Player.tsx` - Renders the sprite based on the `avatarId` and `avatarLevel`.
- `src/App.tsx` - Handles fetching localstorage data and providing it to Redux.

### Notes

- We need to address the race condition in `GameContext.tsx` where setting the player name and avatar ID simultaneously resets parts of the state. `IntroScreen` calls `setPlayerName` and `setPlayerAvatar` sequentially, which references stale state.
- `AvatarCarousel.tsx` might have issues when passing `onAvatarSelect`.
- `Player.tsx` and `avatars.ts` logic needs audit to ensure sprites are mapped correctly, especially if a user starts with an avatar that has a base level > 1 (like Slime which starts at level 2).

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 `git checkout -b feature/character-selection-audit`
- [ ] 1.0 Refactor GameContext to handle atomic player registration updates
  - [ ] 1.1 In `GameContext.tsx`, add a new function to the context: `registerPlayer: (name: string, avatarId: number) => void`.
  - [ ] 1.2 Implement `registerPlayer` to update both `playerNameState` and `playerAvatarState` using the new values, store them in `localStorage`, and dispatch a single `updatePlayerInfo({ name, avatarId })` call to Redux.
  - [ ] 1.3 Update the initialization `useEffect` in `GameContext.tsx` to safely handle `localStorage` data without race conditions.
- [ ] 2.0 Update IntroScreen to use the new atomic flow
  - [ ] 2.1 In `IntroScreen.tsx`, consume `registerPlayer` from `useGameContext`.
  - [ ] 2.2 In `handleStartGame`, replace `setPlayerName(name)` and `setPlayerAvatar(selectedAvatarId)` with a single call to `registerPlayer(name, selectedAvatarId)`.
  - [ ] 2.3 Do the same in `handleJoinRequest`.
- [ ] 3.0 Audit avatar selection, avatarLevel and sprite mapping in Player.tsx
  - [ ] 3.1 Verify that `updatePlayerInfo` inside `teammatesSlice.ts` accurately retains or adjusts the `avatarLevel` according to the newly assigned avatar's base level requirements, or ensure `getAvatarStage` gracefully handles mismatch.
  - [ ] 3.2 Add error checking logic or default fallbacks in `Player.tsx` to handle when `avatarId` and `avatarLevel` cannot be mapped. (Already partly addressed, but audit it against `avatars.ts`).

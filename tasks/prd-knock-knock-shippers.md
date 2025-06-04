## Product Requirements Document: Knock Knock, Shippers! (MVP)

### 1. Introduction/Overview

This document outlines the requirements for the Minimum Viable Product (MVP) of "Knock Knock, Shippers!", a gamified weekly task reporting system. The game transforms traditional task reporting into an engaging, transparent neighborhood experience where team members maintain virtual homes with announcement boards displaying their weekly accomplishments. The primary goal of this MVP is to deliver a polished and engaging system that establishes a foundation for future monetization and feature expansion.

### 2. Goals

*   **Primary Goal (MVP):** Deliver a polished, engaging weekly task reporting system with professional pixel art design.
*   **Secondary Goal:** Implement a streamlined neighborhood creation and invitation system with team lead approval workflow.
*   **Tertiary Goal:** Establish a technical foundation (Supabase integration, scalable architecture) for future paid expansion features.

### 3. User Stories

#### Team Lead Stories

*   **US-TL-001:** As a team lead, I want to create a neighborhood and get a shareable invitation code, so that I can build my team reporting system.
*   **US-TL-002:** As a team lead, I want to approve team member join requests, so that I can control who accesses our team's task reports.
*   **US-TL-003:** As a team lead, I want to view all active team members' weekly tasks in the neighborhood format, so that I can assess team progress visually.
*   **US-TL-004:** As a team lead, I want to access town hall analytics, so that I can see team performance metrics.

#### Team Member Stories

*   **US-TM-001:** As a team member, I want to join a neighborhood using an invitation code, so that I can participate in team reporting.
*   **US-TM-002:** As a team member, I want to log weekly tasks in free text format with category selection, so that I can accurately describe my accomplishments.
*   **US-TM-003:** As a team member, I want to rank my tasks by personal priority, so that I can highlight my most meaningful contributions.
*   **US-TM-004:** As a team member, I want to explore other occupied houses and read task boards, so that I can stay informed about team activities.
*   **US-TM-005:** As a team member, I want to submit my weekly report by Friday, so that I meet team reporting deadlines.

#### New User Stories

*   **US-NU-001:** As a new user, I want to choose between "Create Neighborhood" or "Join Neighborhood" on the landing page, so that I can get started quickly.
*   **US-NU-002:** As a new user joining via invitation code, I want clear feedback on my request status, so that I know when I can start using the system.

### 4. Functional Requirements

1.  The system must allow users to create a player name and select an avatar from a predefined set of unlocked options.
2.  The system must display a game map with the player's character and other team members' houses.
3.  The system must allow the player character to move around the map using keyboard controls (WASD or arrow keys).
4.  The system must display an interaction prompt when the player is near their own house or a teammate's house.
5.  The system must allow players to interact with their own house to open an activity submission form.
6.  The system must allow players to interact with a teammate's house to view their activity board.
7.  The activity submission form must allow a team member to:
    *   Enter a free-text description for each activity (max 250 characters).
    *   Select a category for each activity: 'Project', 'Ad Hoc', or 'Routine'.
    *   If 'Project' category is selected, choose a project milestone: 'pre-project', 'preparation', 'initiation', 'realization', 'finished', or 'go-live'.
    *   Add multiple activities for the current week.
    *   Reorder activities by priority using drag-and-drop or up/down buttons.
    *   Remove activities.
    *   Submit all logged activities for the current week.
    *   All activity fields must be required for submission.
8.  The activity board must display a list of activities for a specific teammate, sorted by priority.
9.  The activity board must clearly indicate the category and project milestone (if applicable) for each activity.
10. The system must display a game HUD showing the current week, day of the week, and player information.
11. The system must include a leaderboard displaying team members sorted by total activities, along with a breakdown of activity categories.
12. The system must update teammate house levels based on their total activities (e.g., every 10 activities).
13. The system must provide a "How To Play" section with game instructions and controls.
14. The system must display a screen size warning and offer a fullscreen option if the window size is below 1280x720 pixels.

### 5. Non-Goals (Out of Scope for MVP)

*   Advanced analytics or reporting features beyond the basic leaderboard and activity counts.
*   Real-time updates for activity boards across all players.
*   Complex social features such as direct messaging or commenting on activities.
*   Customizable avatars beyond the initial selection and unlocking mechanism.
*   Additional complex game mechanics (e.g., in-game currency, resource management, house customization beyond level upgrades).
*   Full user authentication and neighborhood creation/joining workflows (these are foundational for future phases, but the MVP will focus on the core game loop).
*   Multi-neighborhood support for a single user.

### 6. Design Considerations

*   **Visual Style:** Adherence to the established professional pixel art design for all game assets, characters, and UI elements.
*   **Typography:** Consistent use of the defined pixel fonts (`VT323`, `Press Start 2P`, `Silkscreen`) as per `index.html` and `tailwind.config.js`.
*   **Color Palette:** Strict adherence to the custom color palette defined in `tailwind.config.js` (primary, secondary, accent, success, warning, error).
*   **UI Components:** Utilize existing Tailwind CSS classes and `lucide-react` icons for all UI components to maintain consistency and avoid introducing new UI libraries.
*   **Interactions:** Maintain the established "button-pixel" and "shadow-pixel" styles for interactive elements.
*   **Responsiveness:** While the MVP targets a minimum screen size, future iterations should consider more robust responsive design.

### 7. Technical Considerations

*   **Frontend Framework:** React with TypeScript.
*   **State Management:** Redux Toolkit for managing application state (activities, game state, teammates).
*   **Styling:** Tailwind CSS for utility-first styling.
*   **Build Tool:** Vite for development and bundling.
*   **Asset Management:** Game assets (sprites, map) will be served from the `public` directory.
*   **Data Persistence (Future):** While the MVP uses in-memory Redux state, the architecture should allow for future integration with Supabase for:
    *   User authentication and authorization.
    *   Persistent storage of player data (name, avatar, position), activities, and teammate information.
    *   Potential use of Supabase Edge Functions for backend logic (e.g., processing weekly reports, analytics).
    *   Row Level Security for data access control.

### 8. Success Metrics

*   **Engagement:**
    *   Number of weekly task submissions per active user.
    *   Frequency of users interacting with other team members' activity boards.
    *   User retention rate (e.g., percentage of users returning week-over-week).
*   **Quality/Polish:**
    *   Number of critical bugs reported post-launch.
    *   User feedback on the overall UI/UX and "pixel art" aesthetic.
    *   Performance metrics (e.g., load times, consistent frame rates during gameplay).

### 9. Open Questions

*   None. Decisions for previously asked clarifying questions have been made based on the provided context.
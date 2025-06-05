# Product Requirements Document: Knock Knock, Shippers! (MVP)

## 1. Introduction/Overview

This document outlines the requirements for the Minimum Viable Product (MVP) of "Knock Knock, Shippers!", a gamified weekly task reporting system designed for Digital Transformation teams. The game transforms traditional "what did you get done this week" reporting into an engaging, transparent neighborhood experience where team members maintain virtual homes with announcement boards displaying their weekly accomplishments.

**Problem Statement:** Traditional weekly task reporting lacks engagement and transparency, often resulting in generic updates that don't showcase the true value and effort of team members' work.

**Goal:** Create a focused MVP that delivers core gamified task reporting with professional pixel art design, establishing foundation for future monetization and feature expansion.

## 2. Goals

- **Primary Goal (MVP):** Deliver a polished, engaging weekly task reporting system with professional pixel art design.
- **Secondary Goal:** Implement a streamlined neighborhood creation and invitation system with team lead approval workflow.
- **Tertiary Goal:** Establish a technical foundation (Supabase integration, scalable architecture) for future paid expansion features.

## 3. User Stories

### Team Lead Stories
- **US-TL-001:** As a team lead, I want to create a neighborhood and get a shareable invitation code, so that I can build my team reporting system.
- **US-TL-002:** As a team lead, I want to approve team member join requests when I login, so that I can control who accesses our team's task reports.
- **US-TL-003:** As a team lead, I want to view all active team members' weekly tasks in the neighborhood format, so that I can assess team progress visually.
- **US-TL-004:** As a team lead, I want to access town hall analytics, so that I can see team performance metrics.

### Team Member Stories
- **US-TM-001:** As a team member, I want to join a neighborhood using an invitation code, so that I can participate in team reporting.
- **US-TM-002:** As a team member, I want to log weekly tasks in free text format with category selection, so that I can accurately describe my accomplishments.
- **US-TM-003:** As a team member, I want to rank my tasks by personal priority/pride level, so that I can highlight my most meaningful contributions.
- **US-TM-004:** As a team member, I want to explore other occupied houses and read task boards, so that I can stay informed about team activities.
- **US-TM-005:** As a team member, I want to submit my weekly report by Friday, so that I meet team reporting deadlines.

### New User Stories
- **US-NU-001:** As a new user, I want to choose between "Create Neighborhood" or "Join Neighborhood" on the landing page, so that I can get started quickly.
- **US-NU-002:** As a new user joining via invitation code, I want clear feedback on my request status, so that I know when I can start using the system.

## 4. Functional Requirements

### Core Game Environment
1. The system must display a game map with player character and team member houses using React-based rendering.
2. The system must allow player character to move around the map using keyboard controls (WASD or arrow keys).
3. The system must implement simple boundary checking collision detection to prevent walking through buildings, trees, and bushes.
4. The system must display an interaction prompt when the player is near interactable objects (houses, town hall).

### Neighborhood Layout & Visual States
5. The neighborhood must contain:
   - 4 house positions for team members (1 team lead + 3 members)
   - 1 interactive town hall building
   - Environmental elements: trees, bushes, and decorative materials
   - Vacant positions show as empty dirt blocks (no house buildings)

6. House visual states must display:
   - **Occupied:** Full house with visual indicator for active member
   - **On Leave:** House present but with different visual indicator (no activity indicator)
   - **Vacant:** Empty dirt block with no house structure

### User Authentication & Team Management
7. Landing page must present two primary options: "Create Neighborhood" and "Join Neighborhood"
8. Create Neighborhood flow must:
   - Require user account creation and avatar selection from predefined set
   - Generate unique neighborhood invitation code
   - Assign creator as team lead
   - Provide shareable invitation code

9. Join Neighborhood flow must:
   - Require user account creation and avatar selection
   - Accept neighborhood invitation code input
   - Send join request to team lead
   - Display "Waiting for approval" status

10. Team lead approval system must:
    - Show pending join requests when team lead logs in
    - Allow approve/reject actions
    - Limit team to maximum 4 members (1 lead + 3 members)
    - Assign approved members to available house positions

### Task/Activity Management
11. The system must allow users to interact with their own house to open activity submission form.
12. Activity submission form must allow:
    - Free-text description for each activity (max 250 characters)
    - Category selection: 'Project', 'Ad Hoc', or 'Routine'
    - If 'Project' category selected: choose project milestone (pre-project, preparation, initiation, realization, finished, go-live)
    - Add multiple activities for current week
    - Reorder activities by pride/priority level using drag-and-drop or up/down buttons
    - Remove activities
    - Submit all logged activities for current week
    - All activity fields required for submission

13. **[MUST HAVE - MVP]** Task submission must trigger instant visual feedback:
    - House lighting up animation
    - Satisfying particle effects or sparkles
    - Chimney smoke animation for active submissions
    - Success confirmation with visual celebration

14. The system must allow players to interact with teammate houses to view their activity boards.
15. Activity board must display:
    - List of activities sorted by pride/priority level
    - Category and project milestone indicators
    - Activity submission timestamp
    - **[MUST HAVE - MVP]** Peer interaction features per activity:
      - Comment/reply system for team feedback
      - Quick reaction options (👏, 🔥, 💡, ❤️)
      - Comment thread display with timestamps

### Game HUD & Information Display
16. The system must display game HUD showing:
    - Current week and day of week
    - Player information
    - **[MUST HAVE - MVP]** Achievement notification area for badge popups
    - Interaction prompts

17. **[MUST HAVE - MVP]** Achievement/Badge System must include:
    - **Instant Badges:** "First Submission!", "Early Bird!", "Pride Level Champion!"
    - **Weekly Badges:** "Consistent Reporter", "Team Player", "Most Detailed"
    - **Social Badges:** "Helpful Commenter", "Reaction King/Queen", "Supportive Teammate"
    - Badge popup animations with satisfying visual effects
    - Badge collection display in player profile
    - Progress indicators for upcoming badges

18. The system must provide "How To Play" section with game instructions and controls.
19. The system must display screen size warning and offer fullscreen option if window size is below 1280x720 pixels.

### Analytics & Statistics
20. Town hall must be accessible to all team members and display:
    - Weekly task completion count by member
    - Task category distribution
    - Current week reporting status
    - Team performance metrics
    - **[NICE TO HAVE - Post MVP]** Social engagement metrics (comments, reactions given/received)

21. Leaderboard system must display:
    - Team members sorted by activity points
    - Breakdown of activity categories
    - **[MUST HAVE - MVP]** Badge showcase for each member
    - Fun statistics including:
      - Most productive day of week
      - Submission streaks
      - Category champions
      - Early bird awards
      - Pride level achievements
      - **[MUST HAVE - MVP]** Social engagement stats (most helpful commenter, reaction giver)

22. House progression system must:
    - Calculate points based on activity volume, categories, and pride levels
    - **[NICE TO HAVE - Post MVP]** Bonus points for receiving peer reactions and comments
    - Update house visual appearance based on total points
    - Provide visual feedback for member engagement

### Data Management
23. The system must integrate with Supabase for:
    - User authentication and profiles
    - Neighborhood and team member relationships
    - Task data storage and retrieval
    - Weekly reporting period tracking
    - **[MUST HAVE - MVP]** Badge/achievement data and progress tracking
    - **[MUST HAVE - MVP]** Comments, replies, and peer reactions data

## 5. Non-Goals (Out of Scope for MVP)

- Advanced analytics or reporting features beyond basic leaderboard and activity counts
- Real-time updates for activity boards across all players
- Complex social features such as direct messaging or commenting on activities
- Customizable avatars beyond initial selection and unlocking mechanism
- Additional complex game mechanics (in-game currency, resource management, house customization beyond level upgrades)
- Multi-neighborhood support for a single user
- Mobile app development
- Integration with external project management tools

## 6. Design Considerations

### Visual Design Goals
- **Art Style:** High-fidelity pixel art matching professional aesthetic with consistent sprite resolution
- **Color Palette:** Rich greens for grass areas, warm browns for dirt paths, varied house colors for easy identification
- **Environmental Elements:** Trees, bushes, and rocks as natural barriers with clear pathways
- **Character Design:** Business professional avatars with smooth movement animations

### Technical Design (React-based)
- **Visual Style:** Adherence to established professional pixel art design for all game assets, characters, and UI elements
- **Typography:** Consistent use of defined pixel fonts (`VT323`, `Press Start 2P`, `Silkscreen`)
- **Color Palette:** Strict adherence to custom color palette defined in Tailwind config
- **UI Components:** Utilize existing Tailwind CSS classes and `lucide-react` icons for consistency
- **Interactions:** Maintain established "button-pixel" and "shadow-pixel" styles for interactive elements

## 7. Technical Considerations

### Technology Stack
- **Frontend Framework:** React with TypeScript
- **State Management:** Redux Toolkit for managing application state
- **Styling:** Tailwind CSS for utility-first styling
- **Build Tool:** Vite for development and bundling
- **Asset Management:** Game assets served from public directory
- **Backend:** Supabase for authentication, database, and real-time features

### Database Design
**Core Tables:**
- neighborhoods (id, code, name, created_by, created_at)
- users (id, email, name, avatar, created_at)
- team_members (id, neighborhood_id, user_id, role, status, house_position)
- tasks (id, user_id, week_start, description, category, project_milestone, priority, points, created_at)
- join_requests (id, neighborhood_id, user_id, status, requested_at)
- **[MUST HAVE - MVP]** badges (id, user_id, badge_type, earned_at, badge_data)
- **[MUST HAVE - MVP]** task_interactions (id, task_id, user_id, interaction_type, content, created_at)
- **[MUST HAVE - MVP]** reactions (id, task_id, user_id, reaction_type, created_at)

### Performance Considerations
- Simple boundary checking for collision detection
- Efficient asset loading and caching
- Minimal DOM manipulation outside of modals
- Optimized rendering for smooth gameplay experience

## 8. Success Metrics

### Engagement Metrics
- Number of weekly task submissions per active user
- Frequency of users interacting with teammate activity boards
- User retention rate (percentage returning week-over-week)
- Weekly reporting completion rate by Friday deadline

### Quality/Polish Metrics
- Number of critical bugs reported post-launch
- User feedback on UI/UX and pixel art aesthetic
- Performance metrics (load times, consistent frame rates)
- Team onboarding success rate

### Gamification Effectiveness
- Average pride/priority rankings used per submission
- Leaderboard engagement metrics
- Statistics viewing frequency
- House progression advancement rates

## 9. Implementation Phases

### Phase 1 (MVP Launch - 10 Days) *[Extended for engagement features]*
- **Day 1-2:** Core game environment, movement, simple boundary collision
- **Day 3-4:** Authentication, neighborhood creation, invitation system with approval workflow
- **Day 5-6:** Task management, activity boards, drag-and-drop priority system
- **Day 7:** **[CRITICAL]** Instant visual feedback system, task submission animations
- **Day 8:** **[CRITICAL]** Badge/achievement system, peer reaction features
- **Day 9:** **[CRITICAL]** Comment/reply system, social interaction features
- **Day 10:** Town hall analytics, leaderboard with social stats, testing and polish

### Phase 2 (Post-MVP)
- Advanced statistics and fun metrics
- UI/UX improvements and enhanced animations
- Performance optimizations
- User feedback integration
- Enhanced visual effects and polish

### Phase 3 (Future Expansion)
- Advanced team management features
- Additional gamification elements
- Mobile responsiveness improvements
- Integration capabilities

---

**Document Version:** Merged v1.0  
**Last Updated:** June 5, 2025  
**Key Merge Decisions:**
- Combined PRD 1's formal team management with PRD 2's engaging game mechanics
- Integrated comprehensive task management with project milestones and pride-based prioritization
- Merged analytics approaches for both team coordination and individual engagement
- Simplified technical implementation using React while maintaining immersive experience
- Balanced complexity with MVP feasibility for 8-day development timeline
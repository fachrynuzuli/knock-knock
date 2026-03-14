# Knock Knock, Shippers! 🏘️

A gamified team management and weekly task reporting system that transforms boring status updates into an engaging neighborhood experience.

## 🎮 Game Overview

"Knock Knock, Shippers!" is an innovative approach to team coordination where traditional weekly reporting becomes an immersive pixel-art game. Team members live in a virtual neighborhood, each with their own house and activity board, creating transparency and engagement around weekly accomplishments.

### Key Features

- **🏠 Virtual Neighborhood**: Each team member gets their own house with a customizable activity board.
- **📋 Gamified Reporting**: Transform weekly task updates into an engaging game experience.
- **🎯 Priority-Based Tasks**: Rank activities by personal pride and priority levels.
- **🏆 Achievement System**: Earn badges for consistent reporting, early submissions, and team collaboration.
- **📊 Team Analytics**: View team performance through the Town Hall leaderboard.
- **💬 Peer Interaction**: Comment and react to teammates' accomplishments.
- **🎨 Professional Pixel Art**: High-quality retro aesthetic with smooth animations.

## 🏗️ System Architecture & Data Flow

```mermaid
graph TD
    subgraph Client [Frontend App]
        UI[React UI Components]
        State[Redux Store]
        Local[Local Storage]
        
        UI <-->|Actions & Selectors| State
        State -.->|Persists Session| Local
    end
    
    subgraph Engine [Game Engine]
        Map[Game Map & Rendering]
        Col[Collision Detection]
        Input[Player Input Handler]
        
        Input --> UI
        Input --> Map
        Map <--> Col
    end

    subgraph Future Backend [Supabase - Phase 3]
        Auth[Authentication]
        DB[(PostgreSQL DB)]
        Realtime[Realtime Subscriptions]
    end

    State -.->|Future Sync| DB
    State -.->|Future Events| Realtime
    UI -.->|OAuth / Local| Auth
```

## 🔄 User Journey

```mermaid
journey
    title Weekly Reporting Flow
    section Setup
      Launch App: 5: User
      Create/Join Neighborhood: 4: User, App
      Select Avatar: 5: User, App
    section Gameplay
      Walk to House (WASD): 5: User, Game Engine
      Press 'E' to Interact: 4: User, UI
      Log Weekly Activity: 5: User, State
    section Progress
      Earn Badges & EXP: 5: System
      View Town Hall Leaderboard: 4: User, Game Engine
```

## 🎯 How It Works

1. **Create or Join**: Start a new neighborhood as a team lead or join an existing one with an invitation code.
2. **Explore**: Walk around the neighborhood using WASD keys to visit teammates' houses.
3. **Report Weekly**: Update your activity board every Friday with accomplished tasks.
4. **Categorize Tasks**: Organize activities as Project, Ad Hoc, or Routine work.
5. **Engage**: View teammates' boards, leave comments, and react to their achievements.
6. **Progress**: Earn badges and watch your house level up based on activity and engagement.

## 🎮 Game Controls

- **WASD**: Move your character around the neighborhood
- **Arrow Keys**: Pan the camera to explore the map
- **E / Space**: Interact with houses, boards, and the Town Hall
- **L**: Toggle the team leaderboard
- **ESC**: Close open dialogs and forms
- **+/- Buttons**: Zoom in and out of the map

## 🛠️ Technology Stack

### Current Implementation (V1)
- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React

### Target Architecture (V2)
- **Backend & Auth**: Supabase
- **Real-time Engine**: Supabase Presence & Broadcast
- **Data Fetching**: React Query / SWR

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fachrynuzuli/knock-knock.git
cd knock-knock
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 🎯 Development Roadmap (V2)

```mermaid
gantt
    title Knock Knock v2 Development Roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Phase 1: Bug Fixes
    Pathfinding overhaul       :active, p1a, 2026-03-17, 5d
    Input focus guard          :p1b, 2026-03-17, 1d
    Character selection audit  :p1c, after p1b, 2d
    Debug cleanup & branding   :p1d, after p1c, 1d

    section Phase 2: Mobile
    Virtual joystick           :p2a, after p1a, 3d
    Responsive UI              :p2b, after p2a, 4d
    Tap-to-interact + pinch    :p2c, after p2a, 2d

    section Phase 3: Supabase
    DB schema + Auth           :p3a, after p2b, 5d
    Data migration (Redux→DB)  :p3b, after p3a, 5d
    Realtime subscriptions     :p3c, after p3b, 3d
    Invite system              :p3d, after p3b, 2d

    section Phase 4: Social
    Notifications              :p4a, after p3c, 3d
    Comments & reactions       :p4b, after p4a, 3d
    Real-time presence         :p4c, after p3c, 4d
    Analytics dashboard        :p4d, after p4b, 5d
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and conventions
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for teams who want to make reporting actually enjoyable**

*Transform your team's weekly check-ins from mundane status updates into an engaging neighborhood experience where every accomplishment matters.*
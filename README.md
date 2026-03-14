# Knock Knock, Shippers! 🏘️

A gamified team management and weekly task reporting system that transforms boring status updates into an engaging neighborhood experience.

## 🎮 Game Overview

"Knock Knock, Shippers!" is an innovative approach to team coordination where traditional weekly reporting becomes an immersive pixel-art game. Team members live in a virtual neighborhood, each with their own house and activity board, creating transparency and engagement around weekly accomplishments.

### Key Features

- **🏠 Virtual Neighborhood**: Each team member gets their own house with a customizable activity board
- **📋 Gamified Reporting**: Transform weekly task updates into an engaging game experience
- **🎯 Priority-Based Tasks**: Rank activities by personal pride and priority levels
- **🏆 Achievement System**: Earn badges for consistent reporting, early submissions, and team collaboration
- **📊 Team Analytics**: View team performance through the Town Hall leaderboard
- **💬 Peer Interaction**: Comment and react to teammates' accomplishments
- **🎨 Professional Pixel Art**: High-quality retro aesthetic with smooth animations

## 🎯 How It Works

1. **Create or Join**: Start a new neighborhood as a team lead or join an existing one with an invitation code
2. **Explore**: Walk around the neighborhood using WASD keys to visit teammates' houses
3. **Report Weekly**: Update your activity board every Friday with accomplished tasks
4. **Categorize Tasks**: Organize activities as Project, Ad Hoc, or Routine work
5. **Engage**: View teammates' boards, leave comments, and react to their achievements
6. **Progress**: Earn badges and watch your house level up based on activity and engagement

## 🎮 Game Controls

- **WASD**: Move your character around the neighborhood
- **Arrow Keys**: Pan the camera to explore the map
- **E / Space**: Interact with houses, boards, and the Town Hall
- **L**: Toggle the team leaderboard
- **ESC**: Close open dialogs and forms
- **+/- Buttons**: Zoom in and out of the map

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Redux Toolkit** for predictable state management
- **Tailwind CSS** for utility-first styling and responsive design
- **Framer Motion** for smooth animations and transitions
- **Lucide React** for consistent iconography

### Development Tools
- **Vite** for fast development and optimized builds
- **ESLint** for code quality and consistency
- **TypeScript** for enhanced developer experience and fewer bugs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd knock-knock-shippers
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your Supabase credentials to .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## 🎨 Design Philosophy

The game features a carefully crafted pixel art aesthetic that balances nostalgia with professionalism. Every element from character sprites to UI components follows consistent design principles:

- **Pixel-Perfect Graphics**: All assets use consistent pixel densities and color palettes
- **Professional Color Scheme**: Carefully selected colors that work well in business environments
- **Smooth Animations**: Character movement and UI transitions that feel responsive and polished
- **Accessibility**: High contrast ratios and clear visual hierarchy for all users

## 🏆 Achievement System

Players can earn various badges through different activities:

- **First Submission**: Complete your first weekly update
- **Early Bird**: Submit activities early in the week
- **Pride Champion**: Provide detailed descriptions for all activities
- **Team Player**: Actively engage with teammates' boards
- **Consistent Reporter**: Maintain regular weekly submissions

## 📊 Team Analytics

The Town Hall provides insights into team performance:

- Weekly task completion rates by team member
- Activity category distribution (Project/Ad Hoc/Routine)
- Engagement metrics and social interactions
- House progression and achievement showcases
- Team productivity trends and patterns

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Project Structure

```
src/
├── components/          # React components
│   ├── Game.tsx        # Main game container
│   ├── Player.tsx      # Character sprite and movement
│   ├── GameMap.tsx     # Background map rendering
│   ├── ActivityForm.tsx # Task submission interface
│   └── ...
├── store/              # Redux state management
│   ├── slices/         # Feature-specific state slices
│   └── index.ts        # Store configuration
├── contexts/           # React context providers
└── styles/            # Global styles and Tailwind config
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:

- Code style and conventions
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

- **Phase 1**: Core neighborhood functionality and task reporting
- **Phase 2**: Enhanced social features and team analytics
- **Phase 3**: Mobile responsiveness and advanced gamification
- **Phase 4**: Integration capabilities and enterprise features

---

**Built with ❤️ for teams who want to make reporting actually enjoyable**

*Transform your team's weekly check-ins from mundane status updates into an engaging neighborhood experience where every accomplishment matters.*
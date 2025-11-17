# IPAM Frontend

Modern, responsive web interface for the Hierarchical IP Address Management System.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (to be added)
- **State Management**: 
  - Zustand (client state)
  - TanStack Query (server state)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL
```

### Development

```bash
# Start development server
bun run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
bun run build

# Start production server
bun run start
```

### Code Quality

```bash
# Run linter
bun run lint

# Format code
bun run format

# Check formatting
bun run format:check
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (dashboard)/       # Dashboard routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── ipam/              # IPAM-specific components
│   ├── forms/             # Form components
│   ├── theme/             # Theme components
│   ├── shared/            # Shared components
│   └── providers/         # React providers
├── lib/
│   ├── api/               # API client layer
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand stores
│   ├── themes/            # Theme definitions
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
└── public/                # Static assets

```

## Features

### Phase 1: Foundation (Current)
- ✅ Next.js project setup with Bun
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ Environment configuration
- ✅ Core dependencies installed
- ✅ API client with auth interceptors
- ✅ Zustand stores (auth, UI, theme)
- ✅ Theme system foundation
- ✅ Query client setup
- ✅ Root layout with providers

### Phase 2: Core Features (Next)
- [ ] Authentication system
- [ ] Dashboard implementation
- [ ] Countries management
- [ ] Regions management
- [ ] Hosts management

### Phase 3: Advanced Features
- [ ] Batch operations
- [ ] Search & filtering
- [ ] Analytics & visualizations
- [ ] Audit log viewer

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

## Theme System

The application uses an emotion-inspired theme system with 5 color palettes:
- Pacific Blue (default)
- Sunset Peach
- Forest Green
- Midnight Lavender
- Crimson Red

Each theme supports light and dark modes.

## API Integration

The frontend integrates with the FastAPI backend at `/ipam/*` endpoints:
- `/ipam/countries` - Country management
- `/ipam/regions` - Region management
- `/ipam/hosts` - Host management
- `/ipam/search` - Search functionality
- `/ipam/audit` - Audit logs

## Development Guidelines

- Use TypeScript for all new files
- Follow the existing directory structure
- Use Zustand for client state, TanStack Query for server state
- Implement responsive design (mobile-first)
- Ensure accessibility (WCAG 2.1 AA)
- Write tests for critical functionality

## License

MIT — see `LICENSE` file.

## Publishing

- Create a GitHub repository (if not created) and push the current code:

```bash
# Create repo using GitHub CLI (optional)
gh repo create rohanbatrain/IPAM --public --source=. --remote=origin

# Or add remote manually and push
git remote add origin https://github.com/rohanbatrain/IPAM.git
git branch -M main
git add .
git commit -m "chore: prepare repository for publish"
git push -u origin main
```

- Important: Ensure no secrets are committed. Remove any credential files and keep local environment files out of git (e.g. `.env.local`). The repository already ignores `.env*` in `.gitignore`.

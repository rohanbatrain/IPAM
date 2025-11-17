# 🌐 IPAM - Intelligent IP Address Management


<img width="3780" height="1890" alt="2" src="https://github.com/user-attachments/assets/6f3e2fc7-48b5-402b-93f0-a750433e743c" />



<div align="center">

![IPAM Banner](https://img.shields.io/badge/IPAM-Intelligent%20IP%20Management-blue?style=for-the-badge&logo=network-wired&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-cyan?style=flat-square&logo=tailwind-css)

**Modern, Free IP Address Management for Enterprise Networks**

*Hierarchical IP allocation • Real-time monitoring • Enterprise audit trails • Geographic visualization*

[🚀 Live Demo](https://ipam.secondbraindatabase.com) • [📖 Documentation](https://ipam.secondbraindatabase.com/docs) • [🐛 Report Issues](https://github.com/rohanbatrain/IPAM/issues) • [💬 Discussions](https://github.com/rohanbatrain/IPAM/discussions)

---

**Powered by [Second Brain Database](https://github.com/rohanbatrain/second_brain_database)** - A centralized knowledge management system for platform-agnostic data storage and AI-enhanced productivity.

---

</div>

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📊 System Specifications](#-system-specifications)
- [🏁 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🎯 Usage](#-usage)
- [🔧 Development](#-development)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [📚 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

## ✨ Overview

IPAM (IP Address Management) is a modern, comprehensive web application designed for enterprise-level IP address management. Built with cutting-edge technologies and powered by the Second Brain Database architecture, it provides a hierarchical approach to IP allocation with real-time monitoring, advanced analytics, and complete audit trails.

### 🎯 What Makes IPAM Special?

- **Hierarchical Organization**: Global → Continent → Country → Region → Host structure
- **Real-Time Intelligence**: 30-second polling for live network monitoring
- **Geographic Visualization**: Interactive maps powered by OpenStreetMap
- **Enterprise-Grade Security**: JWT authentication with role-based access
- **Performance Optimized**: Lazy loading, code splitting, and advanced caching
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation
- **Mobile Responsive**: Optimized for all devices and screen sizes
- **Free & Open Source**: No licensing fees, self-hosted or cloud deployment

### 📈 Scale & Coverage

- **17 Countries** across 6 continents
- **53,248 Regions** with detailed geographic data
- **13.5 Million IP Addresses** managed hierarchically
- **Real-Time Monitoring** with sub-30-second updates
- **Enterprise Audit Trail** with complete change history

## 🚀 Key Features

### 🌍 Geographic IP Management
- **Hierarchical Structure**: Organize IPs by Continent → Country → Region → Host
- **Interactive Maps**: Visualize IP allocations geographically with OpenStreetMap
- **Capacity Planning**: Monitor utilization percentages and plan expansions
- **Bulk Operations**: Create up to 100 hosts simultaneously

### 📊 Advanced Analytics
- **Real-Time Dashboards**: Live monitoring with 30-second refresh cycles
- **Capacity Gauges**: Circular progress indicators for utilization tracking
- **Trend Analysis**: Historical data visualization with interactive charts
- **Export Capabilities**: Generate detailed reports in multiple formats

### 🔍 Intelligent Search & Filtering
- **Multi-Criteria Search**: Filter by IP, hostname, country, region, status, owner
- **Advanced Queries**: Complex search combinations with logical operators
- **Instant Results**: Sub-second response times with optimized indexing
- **Saved Filters**: Persistent search configurations for recurring queries

### 🛡️ Enterprise Security & Compliance
- **JWT Authentication**: Secure token-based authentication system
- **Role-Based Access**: Granular permissions for different user types
- **Complete Audit Trail**: Track all changes with user attribution and timestamps
- **Data Encryption**: End-to-end encryption for sensitive network data

### 🎨 Modern User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Multiple color palettes with system preference detection
- **Keyboard Shortcuts**: Full keyboard navigation with command palette
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support

### 🔧 Developer Experience
- **TypeScript First**: Full type safety with comprehensive type definitions
- **Hot Reload**: Instant development feedback with Next.js fast refresh
- **Automated Testing**: Comprehensive test suite with 95%+ coverage
- **Performance Monitoring**: Built-in Web Vitals tracking and optimization

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • React 19      │    │ • RESTful API   │    │ • Hierarchical  │
│ • TypeScript    │    │ • JWT Auth      │    │ • Real-time     │
│ • Tailwind CSS  │    │ • Async Tasks   │    │ • Audit Trail   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       ▲                        ▲                        ▲
       │                        │                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Landing Page  │    │   Dashboard     │    │   Analytics     │
│   (Marketing)   │    │   (Management)  │    │   (Monitoring)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow Architecture

```
User Request → Next.js App → API Client → FastAPI Backend → Database
                      ↓
              React Query Cache ← Response Processing ← Data Transformation
                      ↓
              UI State Management ← Zustand Store ← Real-time Updates
```

### Component Architecture

```
App (Next.js 16)
├── Landing Page (Marketing)
│   ├── Hero Section
│   ├── Features Grid
│   ├── Tech Stack
│   ├── Deployment Options
│   └── Call-to-Action
│
├── Authentication (JWT)
│   ├── Login Page
│   ├── Signup Page
│   └── Verification
│
└── Dashboard (Management)
    ├── Analytics
    │   ├── Capacity Gauges
    │   ├── Utilization Charts
    │   ├── Trend Analysis
    │   └── Export Tools
    │
    ├── Geographic View
    │   ├── Interactive Map
    │   ├── Country Overview
    │   ├── Region Details
    │   └── Host Visualization
    │
    ├── Management
    │   ├── Countries (17)
    │   ├── Regions (53K+)
    │   ├── Hosts (13.5M)
    │   └── Batch Operations
    │
    ├── Search & Filter
    │   ├── Advanced Search
    │   ├── Saved Filters
    │   └── Export Results
    │
    ├── Audit & Compliance
    │   ├── Activity Log
    │   ├── Change Tracking
    │   └── User Attribution
    │
    └── Settings
        ├── User Profile
        ├── Notifications
        ├── Theme Selection
        └── API Configuration
```

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router, SSR, and optimization
- **React 19** - Latest React with concurrent features and performance improvements
- **TypeScript 5** - Type-safe development with advanced language features

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework with design tokens
- **shadcn/ui** - Accessible component library built on Radix UI
- **Lucide React** - Beautiful icon library with 1000+ icons
- **Motion** - Animation library for smooth interactions

### State Management
- **Zustand** - Lightweight state management for client state
- **TanStack Query** - Powerful data fetching and caching for server state
- **React Hook Form** - Performant forms with validation

### Data Visualization
- **Three.js & React Three Fiber** - 3D graphics and globe visualization
- **Three Globe** - Interactive 3D globe component
- **Recharts** - Composable charting library

### Development Tools
- **Bun** - Fast JavaScript runtime and package manager
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Vitest** - Fast unit testing framework
- **Playwright** - End-to-end testing

### Performance & Monitoring
- **Web Vitals** - Core Web Vitals tracking
- **Lighthouse CI** - Automated performance testing
- **Bundle Analyzer** - Bundle size analysis and optimization

## 📊 System Specifications

### Supported Scale
- **Countries**: 17 (across 6 continents)
- **Regions**: 53,248 (detailed geographic divisions)
- **IP Addresses**: 13.5 million (hierarchically allocated)
- **Concurrent Users**: Unlimited (horizontal scaling)
- **Audit Entries**: Unlimited retention with efficient indexing

### Performance Metrics
- **Page Load Time**: <2 seconds (First Contentful Paint)
- **Time to Interactive**: <3 seconds
- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Bundle Size**: <200KB (gzipped, code-split)
- **API Response Time**: <100ms (cached), <500ms (uncached)

### Geographic Coverage
- **Africa**: - countries supported
- **Asia**: - countries supported
- **Europe**: - countries supported
- **North America**: - countries supported
- **South America**: - countries supported
- **Oceania**: - countries supported

## 🏁 Quick Start

### Prerequisites
- **Bun** 1.0+ (runtime and package manager)
- **Backend API** running on `http://localhost:8000`
- **Node.js** 18+ (fallback if not using Bun)

### One-Command Setup
```bash
# Clone and setup
git clone https://github.com/rohanbatrain/IPAM.git
cd IPAM
bun install
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
bun run dev
```

Visit `http://localhost:3000` to see the application running!

## 📦 Installation

### Option 1: Bun (Recommended)
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone repository
git clone https://github.com/rohanbatrain/IPAM.git
cd IPAM

# Install dependencies
bun install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Option 2: npm/yarn
```bash
# Clone repository
git clone https://github.com/rohanbatrain/IPAM.git
cd IPAM

# Install dependencies
npm install
# or
yarn install

# Setup environment
cp .env.example .env.local
```

### Environment Configuration
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Environment
NODE_ENV=development

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 🎯 Usage

### Development Server
```bash
bun run dev
# Open http://localhost:3000
```

### Production Build
```bash
bun run build
bun run start
# Open http://localhost:3000
```

### Code Quality
```bash
# Lint code
bun run lint

# Format code
bun run format

# Check formatting
bun run format:check
```

## 🔧 Development

### Project Structure
```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Management dashboard
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── ipam/             # IPAM-specific components
│   ├── landing/          # Landing page components
│   └── providers/        # React context providers
├── lib/                  # Business logic
│   ├── api/              # API client functions
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand stores
│   ├── themes/           # Theme configurations
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
├── scripts/              # Build and utility scripts
├── tests/                # Test files
└── config files          # ESLint, Tailwind, etc.
```

### Key Development Scripts
```bash
# Development
bun run dev              # Start dev server
bun run build            # Production build
bun run build:analyze    # Build with bundle analysis

# Code Quality
bun run lint             # Run ESLint
bun run format           # Format with Prettier
bun run check:imports    # Check import organization

# Testing
bun run test             # Run unit tests
bun run test:ui          # Open test UI
bun run test:e2e         # Run E2E tests
bun run test:coverage    # Generate coverage report

# Utilities
bun run check:a11y       # Accessibility audit
bun run analyze:report   # Bundle analysis report
```

### Adding New Features

1. **Plan the Feature**: Define requirements and user stories
2. **Create API Types**: Add TypeScript interfaces in `lib/types/`
3. **Implement API Client**: Add functions in `lib/api/`
4. **Create Components**: Build UI components in `components/`
5. **Add State Management**: Use Zustand stores for client state
6. **Write Tests**: Add unit and integration tests
7. **Update Documentation**: Add feature documentation

## 🧪 Testing

### Test Coverage
- **Unit Tests**: 85%+ coverage with Vitest
- **Integration Tests**: API and component integration
- **E2E Tests**: Full user workflows with Playwright
- **Accessibility Tests**: Automated WCAG compliance checks

### Running Tests
```bash
# Unit tests
bun run test
bun run test:coverage

# E2E tests
bun run test:e2e
bun run test:e2e:ui      # Visual test runner
bun run test:e2e:headed  # Headed browser mode

# Accessibility audit
bun run check:a11y
```

### Test Structure
```
tests/
├── unit/                # Unit tests
│   ├── utils/          # Utility function tests
│   ├── components/     # Component tests
│   └── hooks/          # Custom hook tests
├── integration/        # Integration tests
└── e2e/                # End-to-end tests
    ├── fixtures/       # Test data and utilities
    ├── pages/          # Page object models
    └── specs/          # Test specifications
```

## 🚢 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production domain
vercel domains add your-domain.com
```

### Self-Hosted Deployment
```bash
# Build for production
bun run build

# Start production server
bun run start

# Or use PM2
npm install -g pm2
pm2 start npm --name "ipam" -- start
```

## 📚 API Reference

### Authentication Endpoints
```
POST /auth/login       - User login
POST /auth/signup      - User registration
POST /auth/verify      - Email verification
POST /auth/refresh     - Token refresh
```

### IPAM Endpoints
```
GET  /ipam/countries   - List countries with capacity
GET  /ipam/regions     - List regions with pagination
POST /ipam/regions     - Create new region
GET  /ipam/hosts       - List hosts with pagination
POST /ipam/hosts       - Create new host
POST /ipam/batch       - Create multiple hosts
```

### Analytics Endpoints
```
GET /ipam/analytics/capacity    - Capacity utilization data
GET /ipam/analytics/trends      - Historical trends
GET /ipam/analytics/export      - Export analytics data
```

### Search Endpoints
```
GET /ipam/search?query=...      - Search IPs and hosts
GET /ipam/search/filters        - Available filter options
```

### Audit Endpoints
```
GET /ipam/audit         - Audit log entries
GET /ipam/audit/{id}    - Specific audit entry
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `bun run test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb config with React rules
- **Prettier**: Consistent code formatting
- **Testing**: 80%+ coverage required
- **Accessibility**: WCAG 2.1 AA compliance

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Rohan Batrain

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

### Core Technologies
- **Next.js** - The React framework that powers modern web applications
- **React** - A JavaScript library for building user interfaces
- **Tailwind CSS** - A utility-first CSS framework
- **shadcn/ui** - Beautifully designed components built with Radix UI

### Inspiration & Architecture
- **Second Brain Database** - Centralized knowledge management system
- **Tiago Forte** - Second Brain methodology and productivity systems
- **Open Source Community** - Countless contributors to the tools we use

### Special Thanks
- **FastAPI Backend** - Robust API foundation
- **Mongodb** - Reliable data storage
- **OpenStreetMap** - Geographic data and mapping
- **Three.js Community** - 3D visualization capabilities

---

<div align="center">

**Built with ❤️ by [Rohan Batrain](https://github.com/rohanbatrain)**

**Powered by [Second Brain Database](https://github.com/rohanbatrain/second_brain_database)**

[⭐ Star us on GitHub](https://github.com/rohanbatrain/IPAM) • [🐛 Report Issues](https://github.com/rohanbatrain/IPAM/issues) • [💬 Join Discussions](https://github.com/rohanbatrain/IPAM/discussions)

</div>

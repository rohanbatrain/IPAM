# sbd-nextjs-ipam

The **IP Address Management (IPAM)** module is a specialized interface for visualizing and managing network infrastructure within the Second Brain ecosystem. It features 3D visualizations and detailed network mapping.

## Features

-   **3D Network Visualization**: Interactive globe and network graphs using `three-globe` and `@react-three/fiber`.
-   **IP Management**: Track and manage IP addresses and subnets.
-   **Interactive UI**: Smooth animations with Framer Motion.
-   **Data Querying**: Efficient data fetching with TanStack Query.

## Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/)
-   **Language**: TypeScript
-   **3D Graphics**: Three.js, React Three Fiber, Three Globe
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Data Fetching**: TanStack Query
-   **UI Components**: Radix UI, Lucide React

## Prerequisites

-   Node.js 20+
-   Bun (optional, used in some scripts) or pnpm/npm

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

-   `npm run dev`: Run the development server.
-   `npm run build`: Build the application.
-   `npm run analyze`: Analyze bundle size.
-   `npm test`: Run tests with Vitest.
-   `npm run test:e2e`: Run end-to-end tests with Playwright.

## License

MIT

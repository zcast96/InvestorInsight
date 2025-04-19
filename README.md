
# Portfolio Insight Hub

A mobile-friendly web application for tracking portfolio performance and individual equity holdings with detailed analytics and visualizations.

## Features

- Portfolio-level analytics and performance tracking
- Individual holding fundamentals and metrics
- Asset allocation and sector diversification visualization
- Manual asset entry support
- CSV import functionality
- Real-time financial data integration

## Prerequisites

- Node.js (Latest LTS version recommended)
- NPM (Included with Node.js)

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Chart.js
- Backend: Node.js, Express
- Database: PostgreSQL with Drizzle ORM
- API Integration: Alpha Vantage for financial data

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Set up Alpha Vantage API key in environment variables
   - Configure database connection settings

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared types and schemas
└── attached_assets/ # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Update database schema

## License

MIT

# Project Requirements Document

# Project Title

Portfolio Insight Hub (Working Title)

# Overview

Portfolio Insight Hub is a mobile-friendly web application designed for individual investors to track both portfolio-level performance/risk metrics and detailed fundamental metrics of individual equity holdings in a single, consolidated view. The product aims to provide clear, actionable insights through effective data visualization and flexible asset management, combining manual inputs with external financial data sources.

# Core Goals

- Consolidate portfolio-level analytics and individual holding fundamentals in one responsive web app.
- Enable tracking of both equities and non-equity assets (manual entry).
- Provide clear, actionable visualizations of key portfolio and asset metrics.
- Support near real-time data updates from reliable financial data APIs.
- Ensure ease of manual data entry and persistent storage for all user-provided data.
- Maintain a clean, intuitive, and mobile-optimized user interface.

# Modules/Feature Areas

**1. Portfolio Dashboard**:
  **Description**: Main overview screen displaying aggregated portfolio metrics and visualizations.
  **Features**:
    - Total portfolio value (calculated, near real-time).
    - Asset allocation breakdown (% by class; charted).
    - Diversification breakdown (% by sector/industry for equities; charted).
    - Risk-adjusted return (e.g., Sharpe Ratio).
    - Portfolio volatility (e.g., Standard Deviation).
    - Performance vs. selected benchmarks (charted, multiple timeframes: MTD, YTD, 1yr, etc.).
    - User-triggered data refresh.
**2. Holdings Management**:
  **Description**: Module for viewing and managing list of all portfolio assets.
  **Features**:
    - List view of all assets (equities and manual entries).
    - Add/edit/delete transactions (buy/sell) for each holding, with required fields: ticker, shares, price, date.
    - View detailed info for each holding, including metrics listed below.
    - Clear distinction between API-sourced and manual data (with 'Last Updated' timestamp for manual entries).
    - Persistent storage of user data.
**3. Manual Asset Entry**:
  **Description**: Ability to add and track non-equity assets for full portfolio allocation.
  **Features**:
    - Manual addition of non-equity assets (cash, bonds, etc.) with required fields: name, value, asset class.
    - Persistent storage and clear separation from API-derived assets.
**4. Settings**:
  **Description**: User preferences and portfolio configuration.
  **Features**:
    - Set and change preferred benchmark indices.
    - Configure user preferences (currency display, refresh intervals, etc.).

# Key Metrics to Track

**Portfolio-Level**:
  - Total Portfolio Value (calculated, near real-time)
  - Asset Allocation (% breakdown by class; charted)
  - Diversification (% breakdown by sector/industry for equities; charted)
  - Risk-Adjusted Return (Sharpe Ratio)
  - Portfolio Volatility (Standard Deviation)
  - Performance vs. Benchmarks (MTD, YTD, 1yr, etc.; charted)
**Individual Equity-Level (per holding)**:
  - Ticker, Name, Shares, Avg. Purchase Price, Cost Basis, Current Price, Market Value
  - Unrealized Gain/Loss ($, %)
  - % of Total Portfolio
  - Earnings Per Share (EPS)
  - Price-to-Earnings (P/E) Ratio
  - Revenue Growth (YoY %, manual entry with timestamp)
  - Profit Margins (Gross, Operating, Net; manual entry with timestamp)
  - Return on Equity (ROE)
  - Debt-to-Equity Ratio (manual entry with timestamp)
  - Dividend Yield (%)

# Data Requirements & Sources

**User Input**:
  - Manual entry of transactions (ticker, shares, price, date).
  - Manual entry for non-equity assets (name, value, asset class).
  - Manual input for fundamental metrics not reliably available via API (Revenue Growth, Margins, D/E), with 'Last Updated' timestamp.
**External Financial Data API**:
  - Must integrate with a reliable financial data provider API (e.g., IEX Cloud, Finnhub, Alpha Vantage; to be finalized based on cost, reliability, data coverage).
  - Required data from API: Stock quotes (delayed acceptable), company name, EPS, P/E, Dividend Yield, ROE (if available), benchmark index data.
**Calculated Data**:
  - Total portfolio value, cost basis, market value, gain/loss, allocation %, diversification %, Sharpe Ratio, Volatility, benchmark outperformance.

# Technical Constraints & Considerations

- Platform: Mobile-friendly web application, using Responsive Web Design for optimal UX on desktop, tablet, and mobile browsers.
- No native mobile (iOS/Android) apps in MVP; architecture should not preclude future native development.
- Market data updates: Near real-time (15-20 min delay acceptable); support both auto and user-triggered refresh.
- API reliability & cost: Choose API based on data quality and pricing; handle API failures gracefully.
- Manual data handling: Persist all manual data, distinguish clearly from API data.
- Visualization: Use clear, responsive charts (pie/donut for allocation, line for performance) suitable for web.
- UI/UX: Emphasize clarity, legibility, and ease of use for financial data, across all screen sizes.
- MVP scope: No direct brokerage linking, advanced analytics, or alerts. System should be extensible for future versions.
- Security: If user accounts are used, standard web security best practices (authentication, secure data storage, HTTPS) are mandatory.

# Suggested Technology Stack

**Frontend**:
  - React (for component-based UI, state management, and responsive design)
  - TypeScript (type safety for maintainability)
  - Styled Components or CSS Modules (for scoped, maintainable styling)
  - Chart.js or Recharts (for interactive data visualizations)
**Backend**:
  - Node.js (Express.js for REST API endpoints)
  - TypeScript (for consistency and robustness with frontend)
**Database**:
  - PostgreSQL (relational data storage for user portfolios, transactions, manual metrics, etc.)
**External Integrations**:
  - Financial Data API (IEX Cloud, Finnhub, Alpha Vantage; selection TBD)
  - Optional: Redis (if caching API responses is needed for rate limiting/cost control)
**Authentication & Security**:
  - JWT-based authentication (if user accounts are needed)
  - HTTPS (all endpoints and web app access)
**Testing**:
  - Jest (unit/integration testing)
  - React Testing Library (UI testing)
**Deployment**:
  - Docker (for containerized deployment, if needed)

# Change Management Instructions

**1. Changelog File Requirement**: Create a file named CHANGELOG.md in the project root directory at project initialization.
**2. Changelog Template**: Each entry in the CHANGELOG.md should use the following format:

## [Version or Date: YYYY-MM-DD]

### Added
- Description of newly added features or files.

### Changed
- Description of modifications, refactorings, or updated requirements.

### Fixed
- Description of bugfixes or resolved issues.

### Removed
- Description of features or files removed from the project.

**3. Source File Header Comment**: Every source file (frontend, backend, scripts, etc.) must begin with the following comment:

IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

**4. Change Documentation Policy**: All modifications (feature additions, bug fixes, refactorings, removals, etc.) MUST be recorded in the CHANGELOG.md file before or at the time of committing changes. Each entry must be properly dated, and the relevant source files updated to include clear in-code comments about the nature and purpose of the change. This ensures transparency, avoids redundant fixes, and maintains a clear project history.



# AI Tool Instructions

Before making or proposing any changes to the project, you must:

1. Check the current CHANGELOG.md file in the project root for the latest updates, modifications, and known issues.
2. Review all entries to ensure your proposed change is not duplicating previous fixes or reintroducing removed features/approaches.
3. If proceeding with a change, update the CHANGELOG.md with a concise summary of your change, using the provided template (Added, Changed, Fixed, Removed) and include the current date.
4. When editing any source file, ensure the required header comment is present. Add clear in-code comments explaining what was changed and why, referencing the changelog entry if applicable.
5. Never skip the changelog update process. This is essential for traceability, project maintainability, and collaboration between AI and human contributors.
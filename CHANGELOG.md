# Changelog

## [2024-02-09]

### Added
- New ProfitLossAnalysis component with daily, YTD, and total P/L metrics
- Enhanced navigation structure with categorized sections (Overview, Management, Settings)
- New Import CSV option in Management section
- Manual Asset entry option in Management section

### Changed
- Improved sidebar organization with clear section headers
- Enhanced portfolio tracking capabilities
- Updated Dashboard layout to include P/L analysis
- Refined API response handling for better performance

### Fixed
- Error handling in transaction processing
- Navigation menu structure and routing
- Data refresh mechanism for real-time updates

## [2024-02-09]

### Added
- Interactive dashboard features with filterable views
- Toggleable key metrics visibility controls
- Dynamic data visualization with charts and graphs
- Real-time portfolio data updates
- Improved transaction synchronization

### Changed
- Enhanced UI polish with gradient background
- Improved card hover effects and transitions
- Added smooth button animations
- Refined dashboard spacing and layout
- Removed sample data in favor of real-time calculations

### Changed
- Enhanced UI polish with gradient background
- Improved card hover effects and transitions
- Added smooth button animations
- Refined dashboard spacing and layout

## [2023-07-15]

### Added
- Initial project setup
- Portfolio dashboard with charts and metrics
- Holdings management with transaction support
- Manual asset entry capability
- Settings management
- Integration with Alpha Vantage API for financial data
- In-memory storage for user portfolio data

### Changed
- N/A (initial release)

### Fixed
- Fixed hook import in AppShell.tsx - changed useMobile to useIsMobile to match exported hook name
- Added missing dependencies: react-chartjs-2 and chart.js for chart functionality
- Fixed invalid DOM nesting in Sidebar and MobileNav components by refactoring navigation links

### Removed
- N/A (initial release)

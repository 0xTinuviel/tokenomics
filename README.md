# Tokenomics Dashboard

Interactive dashboard for modeling blockchain token distribution and inflation schedules.

## Features

- **Token Emission Modeling**: Visualize different inflation schedules (linear, halving, logarithmic, exponential)
- **Market Scenario Analysis**: Compare bear/base/bull market conditions
- **GPU Capacity Planning**: Calculate network computational capacity based on subsidy economics
- **Interactive Controls**: Real-time parameter adjustment and scenario modeling

## Tech Stack

- Next.js 14
- React + TypeScript
- Chart.js for interactive visualizations
- Tailwind CSS for styling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Models

- **Inflation Schedules**: Multiple decay patterns for token emission
- **Price Scenarios**: Realistic volatility modeling with ±20% monthly variation
- **GPU Economics**: SOTA GPU capacity calculation based on $/hour costs

## Configuration

Default settings model a 6-year emission period with 40.8% tokens at TGE, but all parameters are adjustable through the UI.
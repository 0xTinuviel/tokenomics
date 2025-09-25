export interface TokenomicsConfig {
  totalSupply: number;
  tgePercentage: number; // 40.8%
  inflationPeriodYears: number; // 6 years
  initialPrice: number;
}

export interface InflationSchedule {
  type: 'linear' | 'halving' | 'logarithmic' | 'exponential';
  parameters: {
    [key: string]: number;
  };
}

export interface PriceScenario {
  name: string;
  multipliers: number[]; // Price multiplier for each time period
  color: string;
}

export interface EmissionDataPoint {
  date: Date;
  dayOfYear: number;
  tokensEmitted: number;
  cumulativeTokens: number;
  tokenPrice: number;
  usdValueEmitted: number;
  cumulativeUsdValue: number;
  inflationRate: number; // Annual percentage
}

export interface ModelResults {
  scenario: string;
  dataPoints: EmissionDataPoint[];
  totalTokensEmitted: number;
  totalUsdValue: number;
  finalInflationRate: number;
}
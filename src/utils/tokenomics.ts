import { TokenomicsConfig, InflationSchedule, PriceScenario, EmissionDataPoint, ModelResults } from '@/types/tokenomics';

export class TokenomicsModel {
  private config: TokenomicsConfig;
  private schedule: InflationSchedule;

  constructor(config: TokenomicsConfig, schedule: InflationSchedule) {
    this.config = config;
    this.schedule = schedule;
  }

  /**
   * Calculate inflation rate at a given time (0 to 1, where 1 = end of period)
   */
  private calculateInflationRate(normalizedTime: number): number {
    const { type, parameters } = this.schedule;
    
    switch (type) {
      case 'linear':
        // Linear decay from max to min
        const maxRate = parameters.maxRate || 0.2; // 20% max
        const minRate = parameters.minRate || 0.01; // 1% min
        return maxRate - (maxRate - minRate) * normalizedTime;

      case 'halving':
        // Bitcoin-style halving every N years
        const halvingPeriod = parameters.halvingPeriod || 1; // years
        const initialRate = parameters.initialRate || 0.2;
        const halvings = Math.floor(normalizedTime * this.config.inflationPeriodYears / halvingPeriod);
        return initialRate / Math.pow(2, halvings);

      case 'logarithmic':
        // Logarithmic decay
        const logBase = parameters.logBase || 0.1;
        const logScale = parameters.logScale || 0.2;
        return logScale * Math.exp(-normalizedTime / logBase);

      case 'exponential':
        // Exponential decay
        const decayRate = parameters.decayRate || 2;
        const expScale = parameters.expScale || 0.2;
        return expScale * Math.pow(1 - normalizedTime, decayRate);

      default:
        return 0.05; // 5% fallback
    }
  }

  /**
   * Calculate token price based on scenario and time
   */
  private calculateTokenPrice(scenario: PriceScenario, timeIndex: number): number {
    const multiplier = scenario.multipliers[Math.min(timeIndex, scenario.multipliers.length - 1)];
    return this.config.initialPrice * multiplier;
  }

  /**
   * Generate emission schedule for a given scenario
   */
  public generateEmissionSchedule(scenario: PriceScenario, daysToModel: number = 365 * 6): ModelResults {
    const dataPoints: EmissionDataPoint[] = [];
    const startDate = new Date();
    const tgeSupply = this.config.totalSupply * (this.config.tgePercentage / 100);
    const remainingSupply = this.config.totalSupply * (1 - this.config.tgePercentage / 100);
    
    let cumulativeTokens = 0;
    let cumulativeUsdValue = 0;

    for (let day = 0; day < daysToModel; day++) {
      const normalizedTime = day / (365 * this.config.inflationPeriodYears);
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);

      // Calculate annual inflation rate for this point in time
      const annualInflationRate = this.calculateInflationRate(normalizedTime);
      
      // Convert to daily emission rate
      const dailyEmissionRate = annualInflationRate / 365;
      
      // Calculate tokens emitted this day (based on current circulating supply)
      const currentCirculatingSupply = tgeSupply + cumulativeTokens;
      const tokensEmitted = currentCirculatingSupply * dailyEmissionRate;
      
      // Don't emit more than remaining supply
      const actualTokensEmitted = Math.min(tokensEmitted, remainingSupply - cumulativeTokens);
      
      cumulativeTokens += actualTokensEmitted;

      // Calculate token price for this time period
      const timeIndex = Math.floor(day / 30); // Monthly price updates
      const tokenPrice = this.calculateTokenPrice(scenario, timeIndex);
      
      const usdValueEmitted = actualTokensEmitted * tokenPrice;
      cumulativeUsdValue += usdValueEmitted;

      dataPoints.push({
        date: new Date(currentDate),
        dayOfYear: day,
        tokensEmitted: actualTokensEmitted,
        cumulativeTokens,
        tokenPrice,
        usdValueEmitted,
        cumulativeUsdValue,
        inflationRate: annualInflationRate * 100, // Convert to percentage
      });

      // Stop if we've emitted all available tokens
      if (cumulativeTokens >= remainingSupply) {
        break;
      }
    }

    return {
      scenario: scenario.name,
      dataPoints,
      totalTokensEmitted: cumulativeTokens,
      totalUsdValue: cumulativeUsdValue,
      finalInflationRate: dataPoints[dataPoints.length - 1]?.inflationRate || 0,
    };
  }
}

/**
 * Default price scenarios
 */
export const defaultPriceScenarios: PriceScenario[] = [
  {
    name: 'Bear Case',
    color: '#ef4444',
    multipliers: generatePriceMultipliers(1.0, 0.5, 72), // Start at 1x, end at 0.5x over 72 months
  },
  {
    name: 'Base Case',
    color: '#3b82f6',
    multipliers: generatePriceMultipliers(1.0, 2.0, 72), // Start at 1x, end at 2x over 72 months
  },
  {
    name: 'Bull Case',
    color: '#10b981',
    multipliers: generatePriceMultipliers(1.0, 5.0, 72), // Start at 1x, end at 5x over 72 months
  },
];

/**
 * Generate price multipliers with some volatility
 */
function generatePriceMultipliers(start: number, end: number, periods: number): number[] {
  const multipliers: number[] = [];
  const baseGrowthRate = Math.pow(end / start, 1 / periods);
  
  for (let i = 0; i <= periods; i++) {
    // Base exponential growth
    let multiplier = start * Math.pow(baseGrowthRate, i);
    
    // Add some volatility (±20% random variation)
    const volatility = 0.2;
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    multiplier *= randomFactor;
    
    // Ensure multiplier doesn't go negative
    multiplier = Math.max(0.01, multiplier);
    
    multipliers.push(multiplier);
  }
  
  return multipliers;
}

/**
 * Default tokenomics configuration
 */
export const defaultTokenomicsConfig: TokenomicsConfig = {
  totalSupply: 1000000000, // 1B tokens
  tgePercentage: 40.8,
  inflationPeriodYears: 6,
  initialPrice: 1.0, // $1
};

/**
 * Default inflation schedules
 */
export const defaultInflationSchedules: { [key: string]: InflationSchedule } = {
  linear: {
    type: 'linear',
    parameters: {
      maxRate: 0.15, // 15% max annual
      minRate: 0.02, // 2% min annual
    },
  },
  halving: {
    type: 'halving',
    parameters: {
      initialRate: 0.12, // 12% initial
      halvingPeriod: 2, // Every 2 years
    },
  },
  logarithmic: {
    type: 'logarithmic',
    parameters: {
      logBase: 0.3,
      logScale: 0.15,
    },
  },
  exponential: {
    type: 'exponential',
    parameters: {
      decayRate: 1.5,
      expScale: 0.15,
    },
  },
};
'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ModelResults } from '@/types/tokenomics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EmissionChartProps {
  results: ModelResults[];
  showTokens: boolean;
  showUSD: boolean;
  showCumulative: boolean;
}

export const EmissionChart: React.FC<EmissionChartProps> = ({
  results,
  showTokens,
  showUSD,
  showCumulative,
}) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
        title: {
          display: true,
          text: `Token Emission ${showCumulative ? 'Cumulative' : 'Daily'} - ${showTokens && showUSD ? 'Tokens & USD' : showTokens ? 'Tokens' : 'USD Value'}`,
        },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label.includes('USD')) {
              return `${label}: $${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
            } else if (label.includes('Tokens')) {
              return `${label}: ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens`;
            }
            return `${label}: ${value.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: 'Time (Days)',
        },
        min: 0,
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: showTokens && showUSD ? 'Value' : showTokens ? 'Tokens' : 'USD Value ($)',
        },
      },
      y1: showTokens && showUSD ? {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'USD Value',
        },
        grid: {
          drawOnChartArea: false,
        },
      } : undefined,
    },
  };

  const datasets = results.flatMap((result) => {
    const baseDatasets = [];
    
    if (showTokens) {
      baseDatasets.push({
        label: `${result.scenario} - Tokens ${showCumulative ? 'Cumulative' : 'Daily'}`,
        data: result.dataPoints.map(point => ({
          x: point.dayOfYear,
          y: showCumulative ? point.cumulativeTokens : point.tokensEmitted,
        })),
        borderColor: result.scenario.includes('Bear') ? '#ef4444' : 
                    result.scenario.includes('Bull') ? '#10b981' : '#3b82f6',
        backgroundColor: (result.scenario.includes('Bear') ? '#ef4444' : 
                         result.scenario.includes('Bull') ? '#10b981' : '#3b82f6') + '20',
        yAxisID: 'y',
        tension: 0.1,
      });
    }
    
    if (showUSD) {
      baseDatasets.push({
        label: `${result.scenario} - USD ${showCumulative ? 'Cumulative' : 'Daily'}`,
        data: result.dataPoints.map(point => ({
          x: point.dayOfYear,
          y: showCumulative ? point.cumulativeUsdValue : point.usdValueEmitted,
        })),
        borderColor: (result.scenario.includes('Bear') ? '#ef4444' : 
                     result.scenario.includes('Bull') ? '#10b981' : '#3b82f6'),
        backgroundColor: (result.scenario.includes('Bear') ? '#ef4444' : 
                         result.scenario.includes('Bull') ? '#10b981' : '#3b82f6') + '20',
        borderDash: showTokens ? [5, 5] : undefined, // Dashed line if showing both
        yAxisID: showTokens && showUSD ? 'y1' : 'y',
        tension: 0.1,
      });
    }
    
    return baseDatasets;
  });

  const data = {
    labels: [], // Chart.js needs labels array even if empty for scatter plots
    datasets,
  };


  return (
    <div className="w-full h-96">
      <Line options={options} data={data} />
    </div>
  );
};
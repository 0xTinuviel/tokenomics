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

interface InflationRateChartProps {
  results: ModelResults[];
}

export const InflationRateChart: React.FC<InflationRateChartProps> = ({ results }) => {
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
        text: 'Annual Inflation Rate Over Time',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
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
        display: true,
        title: {
          display: true,
          text: 'Annual Inflation Rate (%)',
        },
        min: 0,
      },
    },
  };

  // Since inflation rate is the same across scenarios (only price differs),
  // we just need one line from the first result
  const inflationData = results.length > 0 ? results[0].dataPoints : [];
  

  const data = {
    labels: [], // Chart.js needs labels array
    datasets: [
      {
        label: 'Annual Inflation Rate',
        data: inflationData.map(point => ({
          x: point.dayOfYear,
          y: point.inflationRate,
        })),
        borderColor: '#8b5cf6',
        backgroundColor: '#8b5cf620',
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  };

  return (
    <div className="w-full h-80">
      <Line options={options} data={data} />
    </div>
  );
};
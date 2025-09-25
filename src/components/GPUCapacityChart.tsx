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

interface GPUCapacityChartProps {
  results: ModelResults[];
  gpuCostPerHour: number;
}

export const GPUCapacityChart: React.FC<GPUCapacityChartProps> = ({
  results,
  gpuCostPerHour = 2.0, // Default $2/hour
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
        text: `GPU Network Capacity (SOTA GPUs @ $${gpuCostPerHour}/hr)`,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${Math.floor(value).toLocaleString()} GPUs`;
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
          text: 'Number of SOTA GPUs',
        },
        min: 0,
      },
    },
  };

  // Calculate GPU capacity for each scenario
  const datasets = results.map((result) => {
    const dailyGPUCost = gpuCostPerHour * 24; // Cost to run 1 GPU for 24 hours
    
    return {
      label: `${result.scenario}`,
      data: result.dataPoints.map(point => ({
        x: point.dayOfYear,
        y: point.usdValueEmitted / dailyGPUCost, // Number of GPUs that could be supported
      })),
      borderColor: result.scenario.includes('Bear') ? '#ef4444' : 
                  result.scenario.includes('Bull') ? '#10b981' : '#3b82f6',
      backgroundColor: (result.scenario.includes('Bear') ? '#ef4444' : 
                       result.scenario.includes('Bull') ? '#10b981' : '#3b82f6') + '20',
      tension: 0.1,
      pointRadius: 0,
      pointHoverRadius: 5,
    };
  });

  const data = {
    labels: [],
    datasets,
  };

  return (
    <div className="w-full h-96">
      <Line options={options} data={data} />
    </div>
  );
};
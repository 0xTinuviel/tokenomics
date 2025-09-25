'use client';

import React from 'react';
import { ModelResults } from '@/types/tokenomics';
import { TrendingUp, DollarSign, Coins, Calendar } from 'lucide-react';

interface SummaryCardsProps {
  results: ModelResults[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ results }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(1)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(1)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };

  const formatCurrency = (num: number) => {
    return `$${formatNumber(num)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {results.map((result) => (
        <div key={result.scenario} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{result.scenario}</h3>
            <div className={`w-3 h-3 rounded-full ${
              result.scenario.includes('Bear') ? 'bg-red-500' :
              result.scenario.includes('Bull') ? 'bg-green-500' : 'bg-blue-500'
            }`} />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Coins className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Total Tokens Emitted</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(result.totalTokensEmitted)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Total USD Value</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(result.totalUsdValue)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Final Inflation Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  {result.finalInflationRate.toFixed(2)}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.ceil(result.dataPoints.length / 365)} years
                </p>
              </div>
            </div>
          </div>
          
          {/* Price trajectory indicator */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Price Performance</p>
            <div className="flex items-center space-x-2">
              {result.dataPoints.length > 0 && (
                <>
                  <span className="text-sm font-medium">
                    ${result.dataPoints[0].tokenPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-sm font-medium">
                    ${result.dataPoints[result.dataPoints.length - 1].tokenPrice.toFixed(2)}
                  </span>
                  <span className={`text-sm font-bold ${
                    result.dataPoints[result.dataPoints.length - 1].tokenPrice > result.dataPoints[0].tokenPrice
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({((result.dataPoints[result.dataPoints.length - 1].tokenPrice / result.dataPoints[0].tokenPrice - 1) * 100).toFixed(0)}%)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
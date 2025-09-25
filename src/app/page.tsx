'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TokenomicsModel, defaultTokenomicsConfig, defaultInflationSchedules, defaultPriceScenarios } from '@/utils/tokenomics';
import { TokenomicsConfig, InflationSchedule, ModelResults } from '@/types/tokenomics';
import { EmissionChart } from '@/components/EmissionChart';
import { InflationRateChart } from '@/components/InflationRateChart';
import { GPUCapacityChart } from '@/components/GPUCapacityChart';
import { ControlPanel } from '@/components/ControlPanel';
import { SummaryCards } from '@/components/SummaryCards';
import { TrendingUp, BarChart3, Settings2 } from 'lucide-react';

export default function TokenomicsDashboard() {
  const [config, setConfig] = useState<TokenomicsConfig>(defaultTokenomicsConfig);
  const [schedule, setSchedule] = useState<InflationSchedule>(defaultInflationSchedules.linear);
  const [showTokens, setShowTokens] = useState(false);
  const [showUSD, setShowUSD] = useState(true);
  const [showCumulative, setShowCumulative] = useState(false);
  const [gpuCostPerHour, setGpuCostPerHour] = useState(2.0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate model results whenever config or schedule changes
  const modelResults = useMemo(() => {
    try {
      const model = new TokenomicsModel(config, schedule);
      const results: ModelResults[] = [];
      
      for (const scenario of defaultPriceScenarios) {
        try {
          const result = model.generateEmissionSchedule(scenario);
          results.push(result);
        } catch (error) {
          console.error(`Error generating scenario ${scenario.name}:`, error);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error in modelResults calculation:', error);
      return [];
    }
  }, [config, schedule]);

  useEffect(() => {
    // Only stop loading when we have valid model results
    if (modelResults.length > 0) {
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [modelResults]);

  const handleDisplayChange = ({ tokens, usd, cumulative }: { tokens: boolean; usd: boolean; cumulative: boolean }) => {
    setShowTokens(tokens);
    setShowUSD(usd);
    setShowCumulative(cumulative);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating tokenomics models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tokenomics Dashboard</h1>
                <p className="text-sm text-gray-600">Interactive inflation modeling for blockchain projects</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Total Supply:</span> {config.totalSupply.toLocaleString()} tokens
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">TGE:</span> {config.tgePercentage}%
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              config={config}
              schedule={schedule}
              onConfigChange={setConfig}
              onScheduleChange={setSchedule}
              showTokens={showTokens}
              showUSD={showUSD}
              showCumulative={showCumulative}
              onDisplayChange={handleDisplayChange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Summary Cards */}
            <SummaryCards results={modelResults} />

            {/* Charts */}
            <div className="space-y-8">
              {/* Emission Chart */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Token Emission Analysis</h2>
                </div>
                {(showTokens || showUSD) ? (
                  <EmissionChart
                    results={modelResults}
                    showTokens={showTokens}
                    showUSD={showUSD}
                    showCumulative={showCumulative}
                  />
                ) : (
                  <div className="h-96 flex items-center justify-center text-gray-500">
                    <p>Select at least one display option (Tokens or USD) to view the chart</p>
                  </div>
                )}
              </div>

              {/* Inflation Rate Chart */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2 mb-6">
                  <Settings2 className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Inflation Rate Schedule</h2>
                </div>
                <InflationRateChart results={modelResults} />
              </div>

              {/* GPU Capacity Chart */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    <h2 className="text-xl font-semibold text-gray-900">GPU Network Capacity</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">GPU Cost/Hour:</label>
                    <span className="text-lg font-semibold">${gpuCostPerHour.toFixed(2)}</span>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={gpuCostPerHour}
                      onChange={(e) => setGpuCostPerHour(parseFloat(e.target.value))}
                      className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <GPUCapacityChart results={modelResults} gpuCostPerHour={gpuCostPerHour} />
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Emission Summary</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Initial circulating supply: {(config.totalSupply * config.tgePercentage / 100).toLocaleString()} tokens ({config.tgePercentage}%)</li>
                    <li>• Available for emission: {(config.totalSupply * (100 - config.tgePercentage) / 100).toLocaleString()} tokens ({(100 - config.tgePercentage).toFixed(1)}%)</li>
                    <li>• Emission period: {config.inflationPeriodYears} years</li>
                    <li>• Schedule type: {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Scenario Comparison</h3>
                  <div className="space-y-2 text-sm">
                    {modelResults.map((result) => (
                      <div key={result.scenario} className="space-y-1">
                        <div className="flex justify-between">
                          <span className={`font-medium ${
                            result.scenario.includes('Bear') ? 'text-red-600' :
                            result.scenario.includes('Bull') ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {result.scenario}:
                          </span>
                          <span className="text-gray-600">
                            ${(result.totalUsdValue / 1e6).toFixed(1)}M total value
                          </span>
                        </div>
                        <div className="flex justify-between pl-4">
                          <span className="text-gray-500">Peak GPU capacity:</span>
                          <span className="text-gray-600">
                            {Math.floor(Math.max(...result.dataPoints.map(p => p.usdValueEmitted / (gpuCostPerHour * 24)))).toLocaleString()} GPUs
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
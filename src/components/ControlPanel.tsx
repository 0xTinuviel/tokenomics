'use client';

import React from 'react';
import { TokenomicsConfig, InflationSchedule } from '@/types/tokenomics';
import { Settings, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface ControlPanelProps {
  config: TokenomicsConfig;
  schedule: InflationSchedule;
  onConfigChange: (config: TokenomicsConfig) => void;
  onScheduleChange: (schedule: InflationSchedule) => void;
  showTokens: boolean;
  showUSD: boolean;
  showCumulative: boolean;
  onDisplayChange: (show: { tokens: boolean; usd: boolean; cumulative: boolean }) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  schedule,
  onConfigChange,
  onScheduleChange,
  showTokens,
  showUSD,
  showCumulative,
  onDisplayChange,
}) => {
  const handleScheduleTypeChange = (type: InflationSchedule['type']) => {
    const defaultParameters = {
      linear: { maxRate: 0.15, minRate: 0.02 },
      halving: { initialRate: 0.12, halvingPeriod: 2 },
      logarithmic: { logBase: 0.3, logScale: 0.15 },
      exponential: { decayRate: 1.5, expScale: 0.15 },
    };

    onScheduleChange({
      type,
      parameters: defaultParameters[type],
    });
  };

  const handleParameterChange = (key: string, value: number) => {
    onScheduleChange({
      ...schedule,
      parameters: {
        ...schedule.parameters,
        [key]: value,
      },
    });
  };

  const renderScheduleControls = () => {
    switch (schedule.type) {
      case 'linear':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Annual Rate: {(schedule.parameters.maxRate * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={schedule.parameters.maxRate}
                onChange={(e) => handleParameterChange('maxRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Annual Rate: {(schedule.parameters.minRate * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                value={schedule.parameters.minRate}
                onChange={(e) => handleParameterChange('minRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        );

      case 'halving':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Rate: {(schedule.parameters.initialRate * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={schedule.parameters.initialRate}
                onChange={(e) => handleParameterChange('initialRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Halving Period: {schedule.parameters.halvingPeriod.toFixed(1)} years
              </label>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={schedule.parameters.halvingPeriod}
                onChange={(e) => handleParameterChange('halvingPeriod', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        );

      case 'logarithmic':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scale: {(schedule.parameters.logScale * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={schedule.parameters.logScale}
                onChange={(e) => handleParameterChange('logScale', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base: {schedule.parameters.logBase.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={schedule.parameters.logBase}
                onChange={(e) => handleParameterChange('logBase', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        );

      case 'exponential':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scale: {(schedule.parameters.expScale * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={schedule.parameters.expScale}
                onChange={(e) => handleParameterChange('expScale', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decay Rate: {schedule.parameters.decayRate.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={schedule.parameters.decayRate}
                onChange={(e) => handleParameterChange('decayRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      {/* Basic Configuration */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Basic Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Supply (tokens)
            </label>
            <input
              type="number"
              value={config.totalSupply}
              onChange={(e) => onConfigChange({ ...config, totalSupply: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TGE Percentage: {config.tgePercentage}%
            </label>
            <input
              type="range"
              min="1"
              max="80"
              step="0.1"
              value={config.tgePercentage}
              onChange={(e) => onConfigChange({ ...config, tgePercentage: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={config.initialPrice}
              onChange={(e) => onConfigChange({ ...config, initialPrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inflation Period: {config.inflationPeriodYears} years
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={config.inflationPeriodYears}
              onChange={(e) => onConfigChange({ ...config, inflationPeriodYears: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Inflation Schedule */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Inflation Schedule</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Type</label>
          <div className="flex flex-wrap gap-2">
            {['linear', 'halving', 'logarithmic', 'exponential'].map((type) => (
              <button
                key={type}
                onClick={() => handleScheduleTypeChange(type as InflationSchedule['type'])}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  schedule.type === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {renderScheduleControls()}
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Display Options</h3>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showTokens}
              onChange={(e) => onDisplayChange({ tokens: e.target.checked, usd: showUSD, cumulative: showCumulative })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="text-sm text-gray-700">Show Token Emissions</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showUSD}
              onChange={(e) => onDisplayChange({ tokens: showTokens, usd: e.target.checked, cumulative: showCumulative })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="text-sm text-gray-700">Show USD Values</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showCumulative}
              onChange={(e) => onDisplayChange({ tokens: showTokens, usd: showUSD, cumulative: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="text-sm text-gray-700">Show Cumulative (vs Daily)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
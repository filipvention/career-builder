import React from 'react';
import { CareerNote } from '../types';
import { Filter } from "lucide-react";

interface FilterBarProps {
  selectedFilter: CareerNote['type'] | 'all';
  onFilterChange: (filter: CareerNote['type'] | 'all') => void;
  noteCounts: Record<CareerNote['type'], number>;
}

const FilterBar: React.FC<FilterBarProps> = ({selectedFilter, onFilterChange, noteCounts}) => {
  const filters = [
    {key: 'all' as const, label: 'All Notes', color: 'gray'},
    {key: 'achievement' as const, label: 'Achievements', color: 'green'},
    {key: 'project' as const, label: 'Projects', color: 'blue'},
    {key: 'feedback' as const, label: 'Feedback', color: 'purple'},
    {key: 'skill' as const, label: 'Skills', color: 'orange'},
  ];

  const getFilterCount = (filterKey: string) => {
    if (filterKey === 'all') {
      return Object.values(noteCounts).reduce((sum, count) => sum + count, 0);
    }
    return noteCounts[filterKey as CareerNote['type']] || 0;
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      gray: isSelected ? 'bg-gray-100 text-gray-800 border-gray-300' : 'text-gray-600 hover:bg-gray-50',
      green: isSelected ? 'bg-green-100 text-green-800 border-green-300' : 'text-green-600 hover:bg-green-50',
      blue: isSelected ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-blue-600 hover:bg-blue-50',
      purple: isSelected ? 'bg-purple-100 text-purple-800 border-purple-300' : 'text-purple-600 hover:bg-purple-50',
      orange: isSelected ? 'bg-orange-100 text-orange-800 border-orange-300' : 'text-orange-600 hover:bg-orange-50',
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400"/>
          <h3 className="text-lg font-medium text-gray-900">Filter Notes</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`px-4 py-2 rounded-full border font-medium transition-all duration-200 ${
                getColorClasses(filter.color, selectedFilter === filter.key)
              }`}
            >
              {filter.label}
              <span className="ml-2 text-sm bg-white px-2 py-1 rounded-full">
                {getFilterCount(filter.key)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
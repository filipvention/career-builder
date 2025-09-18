import React from 'react';
import { Download, FileText, X } from "lucide-react";

interface ExportBarProps {
  selectedCount: number;
  onExport: () => void;
  onClearSelection: () => void;
  onToggleSelection: () => void;
  isSelectionMode: boolean;
}

const ExportBar: React.FC<ExportBarProps> = ({
                                               selectedCount,
                                               onExport,
                                               onClearSelection,
                                               onToggleSelection,
                                               isSelectionMode
                                             }) => {
  if (!isSelectionMode) {
    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-400"/>
              <h3 className="text-lg font-medium text-gray-900">Export Notes</h3>
            </div>
            <button
              onClick={onToggleSelection}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="h-4 w-4 mr-2"/>
              Select Notes to Export
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-b border-blue-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-blue-800 font-medium">
                {selectedCount} note{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <p className="text-blue-700 text-sm">
              Click notes to select them for export
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClearSelection}
              className="inline-flex items-center px-3 py-2 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              <X className="h-4 w-4 mr-1"/>
              Clear
            </button>

            <button
              onClick={onExport}
              disabled={selectedCount === 0}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4 mr-2"/>
              Export Selected
            </button>

            <button
              onClick={onToggleSelection}
              className="inline-flex items-center px-3 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportBar;
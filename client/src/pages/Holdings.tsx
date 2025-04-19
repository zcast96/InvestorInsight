// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import HoldingsTable from '@/components/holdings/HoldingsTable';
import { Plus, FileText, Upload } from 'lucide-react';

const Holdings: React.FC = () => {
  const [_, setLocation] = useLocation();
  
  const handleAddTransaction = () => {
    setLocation('/add-transaction');
  };
  
  const handleAddManualAsset = () => {
    setLocation('/add-manual-asset');
  };
  
  const handleImportCSV = () => {
    setLocation('/import-csv');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Holdings</h2>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="shadow-sm flex items-center"
            onClick={handleAddTransaction}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Transaction</span>
          </Button>
          <Button 
            variant="outline"
            className="shadow-sm border border-gray-300 flex items-center"
            onClick={handleAddManualAsset}
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Manual Asset</span>
          </Button>
          <Button 
            variant="secondary"
            className="shadow-sm flex items-center"
            onClick={handleImportCSV}
          >
            <Upload className="h-4 w-4 mr-2" />
            <span>Import CSV</span>
          </Button>
        </div>
      </div>

      {/* Holdings Table with Filters */}
      <HoldingsTable />
    </div>
  );
};

export default Holdings;

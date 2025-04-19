// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import CsvImportForm from '@/components/forms/CsvImportForm';
import { ArrowLeft } from 'lucide-react';

const ImportCSV: React.FC = () => {
  const [_, setLocation] = useLocation();
  
  const handleNavigateBack = () => {
    setLocation('/holdings');
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-3" 
          onClick={handleNavigateBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Import Transactions from CSV</h2>
      </div>

      <CsvImportForm />
    </div>
  );
};

export default ImportCSV;
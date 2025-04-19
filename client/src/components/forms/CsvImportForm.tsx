// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, FileText, CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Progress } from '@/components/ui/progress'; 

type ImportStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

const CsvImportForm: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<{
    success: number;
    errors: number;
    totalRows: number;
    errorMessages: string[];
  }>({
    success: 0,
    errors: 0,
    totalRows: 0,
    errorMessages: []
  });
  
  // Handle file drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  // Process the selected file
  const handleFile = (file: File) => {
    // Only accept CSV files
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }
    
    setFile(file);
    setStatus('idle');
    setResults({
      success: 0,
      errors: 0,
      totalRows: 0,
      errorMessages: []
    });
  };
  
  // Remove the selected file
  const handleRemoveFile = () => {
    setFile(null);
    setStatus('idle');
  };
  
  // Upload and process the CSV file
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setStatus('uploading');
      setProgress(10);
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload the file
      const response = await apiRequest('/api/import/csv', {
        method: 'POST',
        body: formData,
      });
      
      setProgress(100);
      
      // Process results
      if (response) {
        const data = await response.json();
        setResults({
          success: data.success || 0,
          errors: data.errors || 0,
          totalRows: data.totalRows || 0,
          errorMessages: data.errorMessages || []
        });
        setStatus('success');
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
        queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
        queryClient.invalidateQueries({ queryKey: ['/api/portfolio/summary'] });
        
        // Show success toast
        toast({
          title: 'Import completed',
          description: `Successfully imported ${data.success} of ${data.totalRows} transactions.`,
          variant: data.errors > 0 ? 'default' : 'default',
        });
      }
    } catch (error) {
      setStatus('error');
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Failed to import CSV file',
        variant: 'destructive',
      });
    }
  };
  
  // Cancel import and go back
  const handleCancel = () => {
    setLocation('/holdings');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Transactions from CSV</CardTitle>
        <CardDescription>
          Upload a CSV file to import multiple transactions at once
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* File drag and drop zone */}
        <div
          className={`
            border-2 border-dashed rounded-md p-6 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            ${status === 'uploading' || status === 'processing' ? 'pointer-events-none opacity-70' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {!file ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop your CSV file here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported format: CSV with transaction data
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                {status === 'idle' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {status === 'uploading' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Uploading and processing file...</p>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              {status === 'success' && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Import completed</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">
                      Successfully imported {results.success} of {results.totalRows} transactions.
                    </p>
                    {results.errors > 0 && (
                      <p className="text-sm text-amber-600 mt-1">
                        {results.errors} transactions had errors.
                      </p>
                    )}
                  </div>
                  
                  {results.errorMessages.length > 0 && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Import Errors</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside text-sm mt-2">
                          {results.errorMessages.slice(0, 5).map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                          {results.errorMessages.length > 5 && (
                            <li>And {results.errorMessages.length - 5} more errors...</li>
                          )}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
              
              {status === 'error' && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Import Failed</AlertTitle>
                  <AlertDescription>
                    There was an error processing your CSV file. Please check the format and try again.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Expected CSV Format</h3>
          <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded-md font-mono overflow-x-auto">
            <p>Trade Date,Symbol,Quantity,Price,Transaction Fee</p>
            <p>04/17/2025,AAPL,10,175.50,0.00</p>
            <p>04/18/2025,MSFT,5,410.25,0.00</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Your CSV file should include headers and the columns shown above. Additional columns will be ignored.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-3 pt-3 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
          disabled={status === 'uploading' || status === 'processing'}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handleUpload}
          disabled={!file || status === 'uploading' || status === 'processing' || status === 'success'}
        >
          {status === 'uploading' ? 'Uploading...' : 'Import Transactions'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CsvImportForm;
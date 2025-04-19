// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateTransaction } from '@/hooks/useHoldings';
import { formatCurrency } from '@/lib/utils';
import { TransactionFormData } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Form validation schema
const transactionSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required').max(10).toUpperCase(),
  transactionType: z.enum(['buy', 'sell']),
  shares: z.coerce.number().positive('Shares must be positive'),
  price: z.coerce.number().positive('Price must be positive'),
  date: z.string().min(1, 'Date is required'),
  includeCommission: z.boolean().default(false),
  commission: z.coerce.number().optional(),
}).refine(data => !data.includeCommission || (data.includeCommission && data.commission !== undefined && data.commission >= 0), {
  message: 'Commission is required when include commission is checked',
  path: ['commission'],
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const AddTransactionForm: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const createTransactionMutation = useCreateTransaction();
  
  // Create form
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      ticker: '',
      transactionType: 'buy',
      shares: undefined,
      price: undefined,
      date: new Date().toISOString().slice(0, 10),
      includeCommission: false,
      commission: 0,
    },
  });

  // Calculate total value
  const calculateTotal = () => {
    const shares = form.watch('shares') || 0;
    const price = form.watch('price') || 0;
    return shares * price;
  };

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      await createTransactionMutation.mutateAsync(data);
      toast({
        title: 'Transaction created',
        description: 'Your transaction has been successfully recorded.',
      });
      setLocation('/holdings');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setLocation('/holdings');
  };

  return (
    <Form {...form}>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AAPL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shares</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0.0001" 
                        step="0.0001"
                        placeholder="Number of shares"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Share</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                        </div>
                        <Input 
                          type="number" 
                          min="0.01" 
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="py-2">
              <div className="border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Total Value</Label>
                <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-800 font-medium mt-1">
                  {formatCurrency(calculateTotal())}
                </div>
              </div>

              <div className="flex items-end">
                <FormField
                  control={form.control}
                  name="includeCommission"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="includeCommission"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include commission</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className={form.watch('includeCommission') ? 'block' : 'hidden'}>
              <FormField
                control={form.control}
                name="commission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Fee</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                        </div>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createTransactionMutation.isPending}
              >
                {createTransactionMutation.isPending ? 'Saving...' : 'Save Transaction'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

export default AddTransactionForm;

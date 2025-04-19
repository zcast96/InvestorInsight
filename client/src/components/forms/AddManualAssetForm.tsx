// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateManualAsset } from '@/hooks/useHoldings';
import { ASSET_CLASSES } from '@/lib/constants';
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
const manualAssetSchema = z.object({
  assetName: z.string().min(1, 'Asset name is required'),
  assetClass: z.string().min(1, 'Please select an asset class'),
  currentValue: z.coerce.number().positive('Value must be positive'),
  notes: z.string().optional(),
});

type ManualAssetFormValues = z.infer<typeof manualAssetSchema>;

const AddManualAssetForm: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const createManualAssetMutation = useCreateManualAsset();
  
  // Create form
  const form = useForm<ManualAssetFormValues>({
    resolver: zodResolver(manualAssetSchema),
    defaultValues: {
      assetName: '',
      assetClass: '',
      currentValue: undefined,
      notes: '',
    },
  });

  const onSubmit = async (data: ManualAssetFormValues) => {
    try {
      await createManualAssetMutation.mutateAsync(data);
      toast({
        title: 'Asset created',
        description: 'Your manual asset has been successfully added.',
      });
      setLocation('/holdings');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create manual asset. Please try again.',
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
              name="assetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bond Fund, Cash Reserves" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assetClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Class</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ASSET_CLASSES.map((assetClass) => (
                        <SelectItem key={assetClass.value} value={assetClass.value}>
                          {assetClass.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value</FormLabel>
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional information about this asset"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={createManualAssetMutation.isPending}
              >
                {createManualAssetMutation.isPending ? 'Saving...' : 'Save Asset'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

export default AddManualAssetForm;

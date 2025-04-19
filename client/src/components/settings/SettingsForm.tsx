// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSettings, useUpdateSettings } from '@/hooks/usePortfolio';
import { DEFAULT_USER_ID, BENCHMARK_OPTIONS, CURRENCY_OPTIONS } from '@/lib/constants';
import { SettingsFormData } from '@/lib/types';
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
import { AlertTriangle } from 'lucide-react';

// Form validation schema
const settingsSchema = z.object({
  primaryBenchmark: z.string().min(1, 'Please select a primary benchmark'),
  secondaryBenchmark: z.string().optional(),
  currencyDisplay: z.string().min(1, 'Please select a currency'),
  autoRefresh: z.boolean().default(false),
  darkMode: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SettingsForm: React.FC = () => {
  const { toast } = useToast();
  const { data: settings, isLoading, error } = useSettings(DEFAULT_USER_ID);
  const updateSettingsMutation = useUpdateSettings(DEFAULT_USER_ID);
  
  // Create form
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      primaryBenchmark: 'SPY',
      secondaryBenchmark: '',
      currencyDisplay: 'USD',
      autoRefresh: false,
      darkMode: false,
    },
  });

  // Update form values when settings are loaded
  React.useEffect(() => {
    if (settings) {
      form.reset({
        primaryBenchmark: settings.primaryBenchmark,
        secondaryBenchmark: settings.secondaryBenchmark || '',
        currencyDisplay: settings.currencyDisplay,
        autoRefresh: settings.autoRefresh,
        darkMode: settings.darkMode,
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await updateSettingsMutation.mutateAsync(data);
      toast({
        title: 'Settings updated',
        description: 'Your settings have been successfully saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center text-red-500 mb-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Error loading settings</span>
          </div>
          <p className="text-gray-500">Please try again later or contact support if the problem persists.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Benchmark Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Benchmark Settings</CardTitle>
            <CardDescription>Choose which market indices to compare your portfolio against</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="primaryBenchmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Benchmark</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a benchmark" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BENCHMARK_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="secondaryBenchmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Benchmark</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {BENCHMARK_OPTIONS
                        .filter(option => option.value !== form.watch('primaryBenchmark'))
                        .map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional secondary benchmark to compare against
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>Customize how your portfolio data is displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currencyDisplay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Display</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="autoRefresh"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto-refresh data</FormLabel>
                    <FormDescription>
                      Automatically refresh data every 15 minutes
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Dark mode</FormLabel>
                    <FormDescription>
                      Use dark color theme for the interface
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export, import, or clear your portfolio data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full sm:w-auto" type="button">
              Export Portfolio Data (CSV)
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" type="button">
              Import Portfolio Data
            </Button>
            <div className="pt-4">
              <Separator />
            </div>
            <Button variant="destructive" className="w-full sm:w-auto" type="button">
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updateSettingsMutation.isPending}
          >
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingsForm;

// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useTopHoldings } from '@/hooks/usePortfolio';
import { formatCurrency, formatPercentage, getValueColorClass } from '@/lib/utils';

const TopHoldings: React.FC = () => {
  const { data, isLoading, error } = useTopHoldings();

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <CardTitle>Top Holdings</CardTitle>
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead className="text-right">% of Portfolio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-danger">Error loading top holdings data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <CardTitle>Top Holdings</CardTitle>
        <Link href="/holdings">
          <Button variant="link" className="text-primary text-sm font-medium">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">% of Portfolio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((holding) => (
                <TableRow 
                  key={holding.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/holdings/${holding.id}`}
                >
                  <TableCell className="font-medium">{holding.symbol}</TableCell>
                  <TableCell className="text-gray-500">{holding.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(holding.value)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={getValueColorClass(holding.gainLoss)}>
                      {formatCurrency(holding.gainLoss)} ({formatPercentage(holding.gainLossPercent / 100)})
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(holding.percentage / 100)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopHoldings;

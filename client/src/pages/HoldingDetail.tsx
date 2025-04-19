// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import React from 'react';
import { useParams } from 'wouter';
import HoldingDetailComponent from '@/components/holdings/HoldingDetail';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

const HoldingDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  
  const id = params?.id ? parseInt(params.id) : null;
  
  if (!id) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-danger">Invalid holding ID</div>
            <Button 
              className="mt-4" 
              onClick={() => setLocation('/holdings')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Holdings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <HoldingDetailComponent id={id} />;
};

export default HoldingDetail;

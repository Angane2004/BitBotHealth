'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockFestivals } from '@/lib/mock-data';
import { Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

type ImpactVariant = 'destructive' | 'default' | 'secondary';

const getImpactColor = (impact: string): ImpactVariant => {
  switch (impact) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    default:
      return 'secondary';
  }
};

export function FestivalCalendar() {
  const upcomingFestivals = mockFestivals
    .filter(f => f.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Upcoming Festivals</CardTitle>
            <CardDescription>High-impact events affecting demand</CardDescription>
          </div>
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingFestivals.map((festival, index) => {
            const daysUntil = differenceInDays(festival.date, new Date());
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium">{festival.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(festival.date, 'MMM dd, yyyy')} • {daysUntil} days
                  </div>
                </div>
                <Badge variant={getImpactColor(festival.impact)}>
                  {festival.impact}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

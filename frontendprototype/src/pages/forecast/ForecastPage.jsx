import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { LineChart } from '../../components/charts/LineChart';
import { LineChart as LineChartIcon, TrendingUp } from 'lucide-react';
import api from '../../services/api';

export default function ForecastPage() {
  const [forecastTrend, setForecastTrend] = useState([]);
  const [forecastSummary, setForecastSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        // In a real scenario, this trend would be a separate forecast chart. For mock, we reuse the trend + append future days.
        const [trendRes, summaryRes] = await Promise.all([
          api.get('/api/costs/trend'),
          api.get('/api/costs/forecast')
        ]);
        
        // Synthesize 30-day forecast data by extending the existing trend
        const baseData = trendRes.data;
        const lastValue = baseData[baseData.length - 1].cost;
        
        const syntheticForecast = [...baseData];
        let runningCost = lastValue;
        
        // Generate extra 30 days of data for the prediction chart
        for (let i = 1; i <= 30; i++) {
          runningCost += (Math.random() * 10 - 3); // random walk drift
          const date = new Date('2024-03-05');
          date.setDate(date.getDate() + i);
          syntheticForecast.push({
            date: date.toISOString().split('T')[0],
            cost: Math.round(Math.max(0, runningCost))
          });
        }

        setForecastTrend(syntheticForecast);
        setForecastSummary(summaryRes.data);
      } catch (error) {
        console.error("Failed to fetch forecast:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (isLoading || !forecastSummary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cost Forecast</h2>
        <p className="text-muted-foreground">30-day AI prediction of your cloud spending trajectory.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-1 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Predicted Complete Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              ₹{forecastSummary.nextMonth.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on historical usage patterns and active instances.
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
           <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="w-5 h-5" />
              30-Day Cost Prediction
            </CardTitle>
            <CardDescription>Estimated daily cost over the next month</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={forecastTrend} dataKey="cost" xAxisKey="date" height={250} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

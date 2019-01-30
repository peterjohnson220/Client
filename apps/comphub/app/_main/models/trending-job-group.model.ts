export interface TrendingJobGroup {
  Name: string;
  Jobs: string[];
  Order: number;
}

export function generateMockTrendingJobGroup(): TrendingJobGroup {
  return {
    Name: 'Overall',
    Jobs: ['Job1', 'Job2', 'Job3', 'Job4', 'Job5'],
    Order: 1
  };
}

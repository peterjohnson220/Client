export interface TrendingJobGroup {
  Name: string;
  Jobs: TrendingJob[];
}

export interface TrendingJob {
  Name: string;
  Count: number;
}

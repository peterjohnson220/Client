export interface JobSalaryTrendResponse {
  PercentageChange: number;
  Data: JobSalaryTrendData[];
}

export interface JobSalaryTrendData {
  EffectiveDate: Date;
  AverageSalaryAnnual: number;
  AverageSalaryHourly: number;
}

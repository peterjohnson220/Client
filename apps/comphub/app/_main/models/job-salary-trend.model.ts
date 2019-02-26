export interface JobSalaryTrendData {
  SalaryAnnual: number;
  SalaryHourly: number;
  EffectiveDate: Date;
}

export interface JobSalaryTrend {
  PercentageChange: number;
  Data: JobSalaryTrendData[];
}

export function generateMockJobSalaryTrend(): JobSalaryTrend {
  return {
    PercentageChange: 1.7962441701274379,
    Data: [
      {
        SalaryAnnual: 84846,
        SalaryHourly: 40.79133173076923,
        EffectiveDate: new Date(2018, 2, 1)
      },
      {
        SalaryAnnual: 86344.32,
        SalaryHourly: 41.511692307692314,
        EffectiveDate: new Date(2019, 2, 1)
      }
    ]
  };
}

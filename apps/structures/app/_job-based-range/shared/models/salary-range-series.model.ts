export interface SalaryRangeSeries {
  MinMidMax: any[];
  Tertile: any[];
  Quartile: SalaryRangeSegments;
  Quintile: any[];
}

export interface SalaryRangeSegments {
  First: any;
  Second: any;
  Third: any;
  Fourth: any;
}

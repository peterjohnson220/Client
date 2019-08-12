import { KendoDropDownItem } from 'libs/models/kendo';

export enum RateType {
  Annual = 'Annual',
  Hourly = 'Hourly'
}

export const Rates: KendoDropDownItem[] = [
  { Name: RateType.Annual, Value: RateType.Annual },
  { Name: RateType.Hourly, Value: RateType.Hourly }
];

export function generateMockRateOption(): KendoDropDownItem {
  return {
    Name: RateType.Annual,
    Value: RateType.Annual
  };
}

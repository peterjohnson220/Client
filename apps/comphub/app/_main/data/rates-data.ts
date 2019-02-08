import { KendoDropDownItem } from '../models';

export enum RateType {
  Annual = 'Annual',
  Hourly = 'Hourly'
}

export const Rates: KendoDropDownItem[] = [
  { Name: RateType.Annual, Value: RateType.Annual },
  { Name: RateType.Hourly, Value: RateType.Hourly }
];

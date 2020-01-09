import { KendoDropDownItem } from 'libs/models/kendo';

export enum WeightType {
  Inc = 'I',
  Org = 'O'
}

export enum WeightTypeDisplay {
  Inc = 'Inc',
  Org = 'Org'
}

export enum WeightTypeDisplayLabeled {
  Inc = 'Inc Weighted',
  Org = 'Org Weighted'
}

export const Weights: KendoDropDownItem[] = [
  { Name: WeightTypeDisplay.Inc, Value: WeightType.Inc },
  { Name: WeightTypeDisplay.Org, Value: WeightType.Org }
];

export const WeightsLabeled: KendoDropDownItem[] = [
  { Name: WeightTypeDisplayLabeled.Inc, Value: WeightType.Inc },
  { Name: WeightTypeDisplayLabeled.Org, Value: WeightType.Org }
];

export function generateMockWeightOption(): KendoDropDownItem {
  return {
    Name: WeightTypeDisplay.Inc,
    Value: WeightType.Inc
  };
}

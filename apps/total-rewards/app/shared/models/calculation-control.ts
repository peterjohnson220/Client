import { BaseControl } from './base-control';
import { CompensationField } from './compensation-field';

export interface CalculationControl extends BaseControl {
  Category: string;
  DataFields: CompensationField[];
  SummaryTitle: string;
}

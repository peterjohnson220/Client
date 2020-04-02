import { BaseControl } from './base-control';
import { CompensationField } from './compensation-field';
import { LabelWithOverride } from './label-with-override';

export interface CalculationControl extends BaseControl {
  Category: string;
  DataFields: CompensationField[];
  Summary: LabelWithOverride;
}

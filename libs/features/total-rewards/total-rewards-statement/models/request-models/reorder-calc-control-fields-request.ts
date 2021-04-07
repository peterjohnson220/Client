import { UpdateControlBase } from './update-control-base';
import { CompensationField } from '../compensation-field';

export interface ReorderCalcControlFieldsRequest extends UpdateControlBase {
  CompensationFields: CompensationField[];
}

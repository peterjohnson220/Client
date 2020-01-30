import { DataViewFieldDataType } from '../request';

export interface ValidateFormulaResponse {
  IsValid: boolean;
  Message: string;
  DataType: DataViewFieldDataType;
}

import { FieldDataType } from '../../_main/models';

export interface FormulaFieldModalObj {
  FieldName: string;
  Formula: string;
  FormulaId?: number;
  Title?: string;
  IsEditable?: boolean;
  DuplicateAllowed?: boolean;
  DataType?: FieldDataType;
}

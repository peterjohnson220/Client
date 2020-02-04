import { FieldDataType } from './field.model';
import { DataViewAccessLevel } from './user-data-view.model';

export interface FormulaFieldModalObj {
  FieldName: string;
  Formula: string;
  FormulaId?: number;
  Title?: string;
  IsEditable?: boolean;
  DuplicateAllowed?: boolean;
  DataType?: FieldDataType;
  IsPublic: boolean;
  AccessLevel?: DataViewAccessLevel;
}

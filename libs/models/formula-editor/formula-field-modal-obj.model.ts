import { FieldDataType, DataViewAccessLevel } from 'libs/ui/formula-editor';


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

export function generateFormulaFieldModalObj(): FormulaFieldModalObj {
  return {
    FieldName: '',
    Formula: '',
    IsPublic: true
  };
}

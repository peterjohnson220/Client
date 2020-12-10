import { FormulaType } from 'libs/features/formula-editor/models';

export interface UpsertFormulaFieldRequest {
  Name: string;
  Formula: string;
  FormulaId?: number;
  BaseEntityId: number;
  DataType: string;
  IsPublic: boolean;
  FormulaTypeId: FormulaType;
}

export interface UpsertFormulaFieldRequest {
  Name: string;
  Formula: string;
  FormulaId?: number;
  BaseEntityId: number;
  DataType: string;
  IsPublic: boolean;
}

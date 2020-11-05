import {LabelWithOverride} from './label-with-override';

export interface CompensationField {
  Id: string;
  DatabaseField: string;
  Name: LabelWithOverride;
  IsVisible: boolean;
  DisplayName?: string;
  Group?: string;
  Type?: string;
}

export interface CompensationFieldGroup {
  DisplayName: number;
  Fields: CompensationField[];
  FilteredFields: CompensationField[];
}

export enum CompensationFieldType {
  EmployeesUdf = 'EmployeesUdf',
  JobsUdf = 'JobsUdf'
}

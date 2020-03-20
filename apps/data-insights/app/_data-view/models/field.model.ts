import { FieldFormatType } from 'libs/models/payfactors-api/reports';

import { DataViewAccessLevel } from './user-data-view.model';

export interface Field {
  EntityId: number;
  Entity: string;
  EntitySourceName: string;
  DataElementId: number;
  SourceName: string;
  DisplayName: string;
  KendoGridField?: string;
  DataType?: FieldDataType;
  IsSelected?: boolean;
  IsSortable: boolean;
  Order?: number;
  DataElementOrder?: number;
  FormulaId?: number;
  FieldType: FieldType;
  Format?: string;
  FormatType?: FieldFormatType;
  IsEditable?: boolean;
  Formula?: string;
  FormulaName?: string;
  SortOrder?: number;
  SortDirection?: 'asc' | 'desc';
  IsPublic?: boolean;
  AccessLevel: DataViewAccessLevel;
}

export interface FieldListItem {
  Entity: string;
  IsSelected: boolean;
  DisplayName: string;
  FieldListItemId: string;
}

export enum FieldDataType {
  Date = 'dateTime',
  Int = 'int',
  Float = 'float',
  String = 'string',
  LongString = 'longString',
  Bit = 'bit'
}

export enum FieldType {
  DataElement = 'DataElement',
  Formula = 'Formula'
}

export function generateMockField(): Field {
  return {
    DataElementId: 1,
    EntityId: 1,
    Entity: 'Jobs',
    DataType: FieldDataType.String,
    DisplayName: 'Job Title',
    EntitySourceName: 'CompanyJobs',
    IsSelected: false,
    Order: 1,
    SourceName: 'Job_Title',
    KendoGridField: 'CompanyJobs.Job_Title',
    IsSortable: true,
    FieldType: FieldType.DataElement,
    Format: 'N1',
    FormulaName: 'Formula Name',
    AccessLevel: DataViewAccessLevel.Owner
  };
}

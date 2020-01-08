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
}

export interface FieldListItem {
  Entity: string;
  IsSelected: boolean;
  DisplayName: string;
  FieldListItemId: string;
}

export enum FieldDataType {
  Date = 'Date',
  Int = 'int',
  Float = 'float',
  String = 'String',
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
    Format: 'N1'
  };
}

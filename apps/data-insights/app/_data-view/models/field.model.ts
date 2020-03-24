import { FieldFormatType, DataViewField, DataViewFieldDataType, DataViewFieldType } from 'libs/models/payfactors-api/reports';

import { DataViewAccessLevel } from './user-data-view.model';
import { formatTypeMapping } from '../helpers/field-format.helper';

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
  FieldFormat?: FieldFormat;
  IsEditable?: boolean;
  Formula?: string;
  FormulaName?: string;
  SortOrder?: number;
  SortDirection?: 'asc' | 'desc';
  IsPublic?: boolean;
  AccessLevel: DataViewAccessLevel;
  Is?: Is;
  KendoGridConfig?: KendoGridConfig;
}

interface Is {
  Numeric: boolean;
  Date: boolean;
  Formula: boolean;
}

interface KendoGridConfig {
  ColumnMenuEnabled: boolean;
}

export interface FieldListItem {
  Entity: string;
  IsSelected: boolean;
  DisplayName: string;
  FieldListItemId: string;
}

export interface FieldFormat {
  Value: string;
  Type: FieldFormatType;
  Format: string;
}

export class FieldCreator {
  static generateIsProperty(dataViewField: DataViewField): Is {
    return {
      Numeric: dataViewField.DataType === DataViewFieldDataType.Int || dataViewField.DataType === DataViewFieldDataType.Float,
      Date: dataViewField.DataType === DataViewFieldDataType.DateTime,
      Formula: dataViewField.FieldType === DataViewFieldType.Formula
    };
  }

  static generateFieldFormatProperty(dataViewField: DataViewField): FieldFormat {
    const isNumericField: boolean = dataViewField.DataType === DataViewFieldDataType.Int || dataViewField.DataType === DataViewFieldDataType.Float;
    const isDateField: boolean = dataViewField.DataType === DataViewFieldDataType.DateTime;
    if (!isNumericField && !isDateField) {
      return null;
    }
    if (!dataViewField.Format) {
      return {
        Value: null,
        Type: formatTypeMapping[dataViewField.DataType],
        Format: null
      };
    }
    const parsedFormat: string[] = dataViewField.Format.split(':');
    const format: string = parsedFormat.length === 2 ? parsedFormat[1] : dataViewField.Format;
    const value: string = parsedFormat.length === 2 ? dataViewField.Format : `${dataViewField.FormatType}:${format}`;
    return {
      Value: value,
      Type: dataViewField.FormatType,
      Format: format
    };
  }

  static generateKendoGridConfigProperty(dataViewField: DataViewField): KendoGridConfig {
    const isNumericField: boolean = dataViewField.DataType === DataViewFieldDataType.Int || dataViewField.DataType === DataViewFieldDataType.Float;
    const isDateField: boolean = dataViewField.DataType === DataViewFieldDataType.DateTime;
    const isFormulaField: boolean = dataViewField.FieldType === DataViewFieldType.Formula;
    return {
      ColumnMenuEnabled: (isNumericField || isDateField || isFormulaField)
    };
  }
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
    FieldFormat: generateMockFieldFormat(),
    FormulaName: 'Formula Name',
    AccessLevel: DataViewAccessLevel.Owner,
    Is: {
      Numeric: false,
      Date: false,
      Formula: false
    }
  };
}

export function generateMockFieldFormat(): FieldFormat {
  return {
    Value: 'percent:1.2-2',
    Type: FieldFormatType.Percent,
    Format: '1.2-2'
  };
}

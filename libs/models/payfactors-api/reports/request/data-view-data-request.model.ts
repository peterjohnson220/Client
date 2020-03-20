import { PagingOptions } from '../../search/request';
import { DataViewAccessLevel } from '../response';

export interface DataViewDataRequest {
  BaseEntityId: number;
  Fields: DataViewField[];
  Filters: DataViewFilter[];
  PagingOptions: PagingOptions;
  WithCount: boolean;
  ApplyDefaultFilters?: boolean;
}

export interface DataViewField {
  EntityId: number;
  Entity: string;
  EntitySourceName: string;
  DataElementId: number;
  SourceName: string;
  DisplayName: string;
  DataType?: DataViewFieldDataType;
  IsSelected?: boolean;
  Order?: number;
  IsSortable: boolean;
  DataElementOrder?: number;
  FormulaId?: number;
  FieldType: DataViewFieldType;
  Format?: string;
  FormatType?: FieldFormatType;
  Formula?: string;
  FormulaName?: string;
  SortOrder?: number;
  SortDirection?: 'asc' | 'desc';
  IsPublic?: boolean;
  AccessLevel?: DataViewAccessLevel;
}

export interface BaseFilter {
  Operator: string;
  Values?: string[];
  DataType?: DataViewFieldDataType;
  FilterType?: string;
}

export interface DataViewFilter extends BaseFilter {
  EntitySourceName: string;
  SourceName: string;
  Value?: string;
  DataElementId?: number;
}

export interface DataViewFilterIdentifier extends BaseFilter {
  DataElementId?: number;
  UserFormulaId?: number;
}

export enum DataViewFieldDataType {
  Bit = 'bit',
  DateTime = 'dateTime',
  Int = 'int',
  Float = 'float',
  String = 'string',
  LongString = 'longString',
  Binary = 'binary',
  Unknown = 'unknown'
}

export enum DataViewFieldType {
  DataElement = 'dataElement',
  Formula = 'formula'
}

export enum FieldFormatType {
  Date = 'date',
  Number = 'number',
  Percent = 'percent'
}

export function getMockDataViewFilter(): DataViewFilter {
  return {
    EntitySourceName: 'CompanyJobs',
    SourceName: 'Job_Title',
    Operator: '=',
    Values: ['123'],
    DataType: DataViewFieldDataType.String,
    FilterType: ''
  };
}

export function getMockDataViewFilterList(numFilters: number): DataViewFilter[] {
  const filters: DataViewFilter[] = [];
  for (let i = 0; i < numFilters; i++) {
    const filter = {
      EntitySourceName: 'CompanyJobs',
      SourceName: `Job_Title${i}`,
      Operator: '=',
      Values: [`Value${i}`],
      DataType: DataViewFieldDataType.String,
      FilterType: ''
    };

    filters.push(filter);
  }
  return filters;
}

import { DataView } from './data-views-generic.model';

export interface ExportGridRequest {
  DataView: DataView;
  Source: string;
  CustomExportType: string;
}

export interface ExportDataViewRequest {
  DataViewId: number;
  Type: string;
  Source: string;
  ExportFileExtension?: ExportFileExtension;
  CsvFileDelimiter?: CsvFileDelimiter;
}

export enum ExportFileExtension {
  Xlsx = 'Xlsx',
  Csv = 'Csv'
}

export enum CsvFileDelimiter {
  Comma = 'Comma',
  Tab = 'Tab',
  Pipe = 'Pipe'
}

import { DataViewFieldDataType } from 'libs/models/payfactors-api/reports/request';

export interface Field {
  EntityId: number;
  Entity: string;
  EntitySourceName: string;
  DataElementId: number;
  SourceName: string;
  DisplayName: string;
  DataType?: DataViewFieldDataType;
  IsSelected?: boolean;
  Order?: number;
}

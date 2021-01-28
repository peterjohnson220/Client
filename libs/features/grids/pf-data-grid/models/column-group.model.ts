import { ViewField } from 'libs/models/payfactors-api/reports';

export interface ColumnGroup {
  GroupIndex: number;
  Title: string;
  Fields: ViewField[];
  FilteredFields: ViewField[];
}

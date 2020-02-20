export interface ListAreaColumnRequest {
  ListAreaColumnId: number;
  ColumnDatabaseName: string;
  ColumnDisplayName: string;
  ColumnDataType: string;
  Visible: boolean;
  Order: number;
  Default: boolean;
  Required: boolean;
  PublicView: boolean;
}

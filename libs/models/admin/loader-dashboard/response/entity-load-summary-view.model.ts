export interface EntityLoadSummaryView {
  CompositeDataLoadId: number;
  Entity: string;
  TotalRecordCount: number;
  InsertCount: number;
  UpdateCount: number;
  DeleteCount: number;
  ValidUnchangedCount: number;
  InvalidCount: number;
}

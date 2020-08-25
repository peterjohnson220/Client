export interface EntityLoadSummaryView {
  compositeDataLoadId: number;
  entity: string;
  totalRecordCount: number;
  insertCount: number;
  updateCount: number;
  deleteCount: number;
  validUnchangedCount: number;
  invalidCount: number;
}

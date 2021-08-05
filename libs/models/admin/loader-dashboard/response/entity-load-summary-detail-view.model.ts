export interface EntityLoadSummaryDetailView {
  compositeDataLoadId: number;
  entity: string;
  detailKey1: string;
  detailKey2: string;
  totalRecordCount: number;
  insertCount: number;
  updateCount: number;
  deleteCount: number;
  validUnchangedCount: number;
  invalidCount: number;
}

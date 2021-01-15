export interface PfDataGridFilter {
  SourceName: string;
  Operator: string;
  Values?: string[];
  ExcludeFromFilterSave?: boolean;
}

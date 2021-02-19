export interface PfDataGridCustomFilterOptions {
  EntitySourceName: string;
  SourceName: string;
  FilterDisplayOptions: PfDataGridCustomFilterDisplayOptions[];
}

export interface PfDataGridCustomFilterDisplayOptions {
  Value: any;
  Display: string;
}

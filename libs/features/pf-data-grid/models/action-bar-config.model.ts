export interface ActionBarConfig {
  AllowExport: boolean;
  ExportSourceName: string;
  ColumnChooserType: ColumnChooserType;
}

export enum ColumnChooserType {
  Column,
  ColumnGroup
}

export function getDefaultActionBarConfig(): ActionBarConfig {
  return {
    AllowExport: false,
    ExportSourceName: '',
    ColumnChooserType: ColumnChooserType.Column
  };
}

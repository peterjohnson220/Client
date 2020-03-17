import { ElementRef } from '@angular/core';

export interface ActionBarConfig {
  ShowActionBar: boolean;
  ShowColumnChooser: boolean;
  ShowFilterChooser: boolean;
  AllowSaveFilter: boolean;
  AllowExport: boolean;
  ExportSourceName: string;
  ColumnChooserType?: ColumnChooserType;
  ActionBarClassName?: string;
  GlobalActionsTemplate?: ElementRef<any>;
  GlobalFiltersTemplates?: { [key: string]: ElementRef<any> };
}

export enum ColumnChooserType {
  Column,
  ColumnGroup
}

export function getDefaultActionBarConfig(): ActionBarConfig {
  return {
    ShowActionBar: true,
    ShowColumnChooser: false,
    ShowFilterChooser: false,
    AllowExport: false,
    AllowSaveFilter: true,
    ExportSourceName: '',
    ColumnChooserType: ColumnChooserType.Column
  };
}
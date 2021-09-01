import { ElementRef } from '@angular/core';

export interface ActionBarConfig {
  ShowActionBar: boolean;
  ShowColumnChooser: boolean;
  ShowFilterChooser: boolean;
  AllowSaveFilter: boolean;
  AllowExport: boolean;
  ExportSourceName: string;
  CustomExportType?: string;
  ExportSelectionRequired?: boolean;
  ExportSelectionRequiredTooltip?: string;
  ColumnChooserConfig?: ColumnChooserConfig;
  ActionBarClassName?: string;
  GlobalActionsTemplate?: ElementRef<any>;
  GlobalFiltersTemplates?: { [key: string]: ElementRef<any> };
  ColumnChooserSubmitText: string;
  ShowSelectAllColumns: boolean;
  EnableGroupSelectAll: boolean;
}

export interface ColumnChooserConfig {
  ColumnChooserType?: ColumnChooserType;
  ColumnChooserTemplate?: ElementRef<any>;
}


export enum ColumnChooserType {
  Column,
  ColumnGroup,
  Hybrid,
  Custom
}

export function getDefaultActionBarConfig(): ActionBarConfig {
  return {
    ShowActionBar: true,
    ShowColumnChooser: false,
    ShowFilterChooser: false,
    AllowExport: false,
    AllowSaveFilter: true,
    ExportSourceName: '',
    ColumnChooserConfig: {
      ColumnChooserType: ColumnChooserType.Column
    },
    ColumnChooserSubmitText: 'Save',
    ShowSelectAllColumns: false,
    EnableGroupSelectAll: false
  };
}

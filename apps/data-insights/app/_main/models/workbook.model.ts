import { AsyncStateObj } from 'libs/models/state';

import { View } from './view.model';
import { ReportType } from './report-types.enum';

export interface Workbook {
  Type: ReportType;
  WorkbookId: string;
  WorkbookName: string;
  Thumbnail: string;
  WorkbookDescription: string;
  ContentUrl: string;
  ShowTabs: boolean;
  IconClass: string[];
  Tag: string;
  IsFavorite: boolean;
  DefaultTag: string;
  IsStandard?: boolean;
  SourceUrl?: string;
  DashboardsOrder?: number;
  FavoritesOrder?: number;
  Views?: AsyncStateObj<View[]>;
}

export function generateMockWorkbook(): Workbook {
  return {
    Type: ReportType.TableauReport,
    WorkbookId: '123456789',
    WorkbookName: 'abc',
    Thumbnail: '',
    WorkbookDescription: 'Report',
    ContentUrl: 'content url',
    ShowTabs: true,
    IconClass: [],
    Tag: '',
    IsFavorite: false,
    DefaultTag: '',
    DashboardsOrder: 1,
    FavoritesOrder: 2
  };
}

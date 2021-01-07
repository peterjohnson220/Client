import { generateMockUserDataView, UserDataView } from 'libs/features';

export interface TabularReportExportSchedule {
  DataViewId: number;
  Format: string;
  FormatSeparatorType: string;
  Frequency: string;
  CronExpression: string;
  LastSentDate?: Date;
  UserDataView?: UserDataView;
  FrequencyTextFormat?: string;
  CreateUser?: number;
  IsDataViewOwner?: boolean;
}

export function generateMockTabularReportExportSchedule(): TabularReportExportSchedule {
  return {
    DataViewId: 0,
    Format: 'CSV',
    FormatSeparatorType: 'Comma',
    Frequency: 'Weekly',
    CronExpression: '0 0 0 ? * MON,THU',
    UserDataView: generateMockUserDataView(),
  };
}

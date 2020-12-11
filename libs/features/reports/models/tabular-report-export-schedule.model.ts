import { UserDataView } from 'libs/features';

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

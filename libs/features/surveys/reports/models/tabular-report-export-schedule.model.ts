import { UserDataView } from '../../../../ui/formula-editor/models';


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

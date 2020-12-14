import { TabularReportExportSchedule } from 'libs/features/reports/models';

import { CronExpressionHelper, ExportFrequencyType } from '../helpers/cron-expression-helper.model';

export class ExportScheduleHelper {
  static csvFileFormat = 'CSV';
  static excelFileFormat = 'Excel';
  static fileFormats: string [] = ['Excel', 'CSV'];

  static mapCronExpressionToTextFormat(schedules: TabularReportExportSchedule[]) {
    return schedules.map(s => {
      return {
        ...s,
        IsDataViewOwner: s.CreateUser === s.UserDataView.CreateUser,
        FrequencyTextFormat: this.getFrequencyTextFormat(s.Frequency, s.CronExpression)
      };
    });
  }

  private static getFrequencyTextFormat(frequency: string, cronExpression?: string): string {
    switch (frequency) {
      case ExportFrequencyType.OneTime:
        return ExportFrequencyType.OneTime;
      case ExportFrequencyType.Weekly:
        return CronExpressionHelper.getWeeklyFrequencyTextFormat(cronExpression);
      case ExportFrequencyType.Monthly:
        return CronExpressionHelper.getMonthlyFrequencyTextFormat(cronExpression);
      default:
        return '';
    }
  }
}

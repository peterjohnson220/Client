import { TabularReportExportSchedule } from 'libs/features/reports/models';

import { CronExpressionHelper, DayOfWeek, ExportFrequencyType } from '../helpers';

export class ExportScheduleHelper {
  static csvFileFormat = 'CSV';
  static excelFileFormat = 'Excel';
  static fileFormats: string [] = ['Excel', 'CSV'];

  static mapCronExpressionToTextFormat(schedules: TabularReportExportSchedule[]): TabularReportExportSchedule[] {
    const filteredSchedules = schedules
      .map(s => this.setScheduleCustomProperties(s))
      .filter(x => x.IsDataViewOwner);
    return filteredSchedules;
  }

  private static setScheduleCustomProperties(schedule: TabularReportExportSchedule): TabularReportExportSchedule {
    return {
      ...schedule,
      IsDataViewOwner: schedule.CreateUser === schedule.UserDataView.CreateUser,
      FrequencyTextFormat: this.getFrequencyTextFormat(schedule.Frequency, schedule.CronExpression)
    };
  }

  static getFrequencyTextFormat(frequency: string, cronExpression?: string): string {
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

export interface ScheduledMonthlyFrequency {
  ScheduledMonthlyOccurrence: string;
  ScheduledDayOfWeek: DayOfWeek[];
}

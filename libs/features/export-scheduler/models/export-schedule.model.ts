export interface ExportFormat {
  Format: string;
  SeparatorType?: string;
}

export interface ExportDayOfWeek {
  Name: string;
  Value: string;
  IsSelected: boolean;
}

export interface ExportMonthlyFrequency {
  Occurrence: string;
  DayOfWeek: ExportDayOfWeek;
}

export enum ExportFileExtension {
  Excel = 'Excel',
  Csv = 'CSV'
}

export enum DaysOfWeek {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday'
}

export enum DaysOfWeekAbbreviations {
  Sunday = 'SUN',
  Monday = 'MON',
  Tuesday = 'TUES',
  Wednesday = 'WED',
  Thursday = 'THURS',
  Friday = 'FRI',
  Saturday = 'SAT'
}

export enum ExportFrequencyType {
  OneTime = 'One-time',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

export enum ExportMonthlyOccurrence {
  First = 'First',
  Second = 'Second',
  Third = 'Third',
  Fourth = 'Fourth'
}



import { DaysOfWeek, DaysOfWeekAbbreviations, ExportDayOfWeek } from '../models/export-schedule.model';


export function initializeDaysOfWeek(): ExportDayOfWeek[] {
  return [
    {
      Name: DaysOfWeek.Sunday,
      Value: DaysOfWeekAbbreviations.Sunday,
      IsSelected: false
    },
    {
      Name: DaysOfWeek.Monday,
      Value: DaysOfWeekAbbreviations.Monday,
      IsSelected: false
    },
    {
      Name: DaysOfWeek.Tuesday,
      Value: DaysOfWeekAbbreviations.Tuesday,
      IsSelected: false
    },
    {
      Name: DaysOfWeek.Wednesday,
      Value: DaysOfWeekAbbreviations.Wednesday,
      IsSelected: false
    },
    {
      Name: DaysOfWeek.Thursday,
      Value: DaysOfWeekAbbreviations.Thursday,
      IsSelected: false
    },
    {
      Name: DaysOfWeek.Friday,
      Value: DaysOfWeekAbbreviations.Friday,
      IsSelected: false
    },
    {
      Name: DaysOfWeek.Saturday,
      Value: DaysOfWeekAbbreviations.Saturday,
      IsSelected: false
    }
  ];
}

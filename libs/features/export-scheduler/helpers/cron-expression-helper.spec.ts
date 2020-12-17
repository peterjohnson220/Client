import { CronExpressionHelper, ExportFrequencyType } from './cron-expression-helper.model';

describe('Export Scheduler - Cron Expression Helper', () => {

  it.each([
    ['* * * ? *', ''],
    ['* * * ? * BAD', ''],
    ['* * * ? * MON,BAD,TUE', 'Weekly on Monday, Tuesday'],
    ['* * * ? * MON', 'Weekly on Monday'],
    ['* * * ? * MON,WED,FRI', 'Weekly on Monday, Wednesday, Friday']
  ])
  ('should return the correct text format for weekly frequency', (cronExpression, expectedTextFormat) => {
    const textFormat = CronExpressionHelper.getWeeklyFrequencyTextFormat(cronExpression);

    expect(textFormat).toEqual(expectedTextFormat);
  });

  it.each([
    ['* * * ? *', ''],
    ['* * * ? * BAD', ''],
    ['* * * ? * BAD#2', ''],
    ['* * * ? * MON#10', ''],
    ['* * * ? * MON#2', 'Second Monday of each month']
  ])
  ('should return the correct text format for monthly frequency', (cronExpression, expectedTextFormat) => {
    const textFormat = CronExpressionHelper.getMonthlyFrequencyTextFormat(cronExpression);

    expect(textFormat).toEqual(expectedTextFormat);
  });

  it.each([
    [ExportFrequencyType.OneTime, [], null, ''],
    [ExportFrequencyType.Weekly, [], null, ''],
    [ExportFrequencyType.Weekly, ['Fakeday'], null, ''],
    [ExportFrequencyType.Weekly, ['Monday', 'Wednesday', 'Friday'], null, '* * * ? * MON,WED,FRI'],
    [ExportFrequencyType.Monthly, [], 'Second', ''],
    [ExportFrequencyType.Monthly, ['Monday'], null, ''],
    [ExportFrequencyType.Monthly, ['Monday', 'Tuesday'], 'Second', ''],
    [ExportFrequencyType.Monthly, ['Fakeday'], 'Second', ''],
    [ExportFrequencyType.Monthly, ['Monday'], '10', ''],
    [ExportFrequencyType.Monthly, ['Monday'], 'Second', '* * * ? * MON#2'],
  ])
  ('should generate correct cron expression', (frequency, daysOfWeek, monthlyOccurrence, expectedCronExpression) => {
    const cronExpression = CronExpressionHelper.generateCronExpression(frequency, daysOfWeek, monthlyOccurrence);

    expect(cronExpression).toEqual(expectedCronExpression);
  });

});

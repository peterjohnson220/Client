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
    [ExportFrequencyType.Weekly, [{ Name: 'Fakeday', Value: 'FAKE', Order: 10 }], null, ''],
    [ExportFrequencyType.Weekly, [
      { Name: 'Monday', Value: 'MON', Order: 1 },
      { Name: 'Wednesday', Value: 'WED', Order: 3 },
      { Name: 'Friday', Value: 'FRI', Order: 5 }],
      null, '* * * ? * MON,WED,FRI'],
    [ExportFrequencyType.Monthly, [], 'Second', ''],
    [ExportFrequencyType.Monthly, [{ Name: 'Monday', Value: 'MON', Order: 1 }], null, ''],
    [ExportFrequencyType.Monthly, [{ Name: 'Monday', Value: 'MON', Order: 1 }, { Name: 'Tuesday', Value: 'TUE', Order: 2 }], 'Second', ''],
    [ExportFrequencyType.Monthly, [{ Name: 'Fakeday', Value: 'FAKE', Order: 10 }], 'Second', ''],
    [ExportFrequencyType.Monthly, [{ Name: 'Monday', Value: 'MON', Order: 1 }], '10', ''],
    [ExportFrequencyType.Monthly, [{ Name: 'Monday', Value: 'MON', Order: 1 }], 'Second', '* * * ? * MON#2'],
  ])
  ('should generate correct cron expression', (frequency, daysOfWeek, monthlyOccurrence, expectedCronExpression) => {
    const cronExpression = CronExpressionHelper.generateCronExpression(frequency, daysOfWeek, monthlyOccurrence);

    expect(cronExpression).toEqual(expectedCronExpression);
  });

});

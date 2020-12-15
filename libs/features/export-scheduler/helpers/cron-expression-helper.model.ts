import { GenericNameValue } from 'libs/models';

export enum ExportFrequencyType {
  OneTime = 'One-time',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

export class CronExpressionHelper {
  static daysOfWeek: GenericNameValue<string>[] = [
    { Name: 'Sunday', Value: 'SUN' },
    { Name: 'Monday', Value: 'MON' },
    { Name: 'Tuesday', Value: 'TUE' },
    { Name: 'Wednesday', Value: 'WED' },
    { Name: 'Thursday', Value: 'THU' },
    { Name: 'Friday', Value: 'FRI' },
    { Name: 'Saturday', Value: 'SAT' }
  ];

  static weeksOfMonth: GenericNameValue<string>[] = [
    { Name: 'First', Value: '1' },
    { Name: 'Second', Value: '2' },
    { Name: 'Third', Value: '3' },
    { Name: 'Fourth', Value: '4' }
  ];

  static getWeeklyFrequencyTextFormat(expression: string): string {
    const cronArray = expression.split(' ');
    if (!cronArray || cronArray.length !== 6) {
      return '';
    }
    let days = cronArray[5].split(',');
    days = days
    .map(d => {
      const dayOfWeek = this.daysOfWeek.find(x => x.Value === d)?.Name ?? '';
      return dayOfWeek;
    })
    .filter(x => x !== '');
    return days?.length > 0 ? `Weekly on ${days.join(', ')}` : '';
  }

  static getMonthlyFrequencyTextFormat(expression: string): string {
    const cronArray = expression.split(' ');
    if (!cronArray || cronArray.length !== 6) {
      return '';
    }
    const dayField = cronArray[5].split('#');
    if (!dayField || dayField.length !== 2) {
      return '';
    }
    const monthlyOccurrence = this.weeksOfMonth.find(x => x.Value === dayField[1])?.Name ?? '';
    const dayOfWeek = this.daysOfWeek.find(x => x.Value === dayField[0])?.Name ?? '';
    if (monthlyOccurrence === '' || dayOfWeek === '') {
      return '';
    }
    return `${monthlyOccurrence} ${dayOfWeek} of each month`;
  }

  static generateCronExpression(frequency: string, daysOfWeek: string[], monthlyOccurrence?: string): string {
    switch (frequency) {
      case ExportFrequencyType.Weekly:
        return this.generateWeeklyCronExpression(daysOfWeek);
      case ExportFrequencyType.Monthly:
        if (daysOfWeek?.length === 1) {
          return this.generateMonthlyCronExpression(monthlyOccurrence, daysOfWeek[0]);
        }
        return '';
      default:
        return '';
    }
  }

  private static generateWeeklyCronExpression(daysOfWeek: string[]): string {
    if (!daysOfWeek?.length) {
      return '';
    }
    const defaultFields = this.getDefaultCronFields();
    const cronDaysOfWeek = daysOfWeek.map(x => {
      const dayOfWeek = this.daysOfWeek.find(d => d.Name === x)?.Value ?? '';
      return dayOfWeek;
    }).filter(x => x !== '');

    return cronDaysOfWeek?.length > 0
      ? `${defaultFields} ${cronDaysOfWeek.join(',')}`
      : '';
  }

  private static generateMonthlyCronExpression(monthlyOccurrence: string, dayOfWeek: string): string {
    if (!monthlyOccurrence?.length || !dayOfWeek?.length) {
      return '';
    }
    const defaultFields = this.getDefaultCronFields();
    const cronOccurrence = this.weeksOfMonth.find(x => x.Name === monthlyOccurrence)?.Value ?? '';
    const cronDayOfWeek = this.daysOfWeek.find(d => d.Name === dayOfWeek)?.Value ?? '';

    return cronOccurrence !== '' && cronDayOfWeek !== ''
      ? `${defaultFields} ${cronDayOfWeek}#${cronOccurrence}`
      : '';
  }

  private static getDefaultCronFields(): string {
    const sec = '0';
    const min = '0';
    const hour = '0';
    const dayOfMonth = '?';
    const month = '*';
    return `${sec} ${min} ${hour} ${dayOfMonth} ${month}`;
  }
}

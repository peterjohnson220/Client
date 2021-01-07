import orderBy from 'lodash/orderBy';

import { GenericNameValue } from 'libs/models';
import { ScheduledMonthlyFrequency } from '../models';

export enum ExportFrequencyType {
  OneTime = 'One-time',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

export interface DayOfWeek {
  Name: string;
  Value: string;
  Order: number;
}

export class CronExpressionHelper {
  static daysOfWeek: DayOfWeek[] = [
    { Name: 'Sunday', Value: 'SUN', Order: 0 },
    { Name: 'Monday', Value: 'MON', Order: 1 },
    { Name: 'Tuesday', Value: 'TUE', Order: 2 },
    { Name: 'Wednesday', Value: 'WED', Order: 3 },
    { Name: 'Thursday', Value: 'THU', Order: 4 },
    { Name: 'Friday', Value: 'FRI', Order: 5 },
    { Name: 'Saturday', Value: 'SAT', Order: 6 }
  ];

  static weeksOfMonth: GenericNameValue<string>[] = [
    { Name: 'First', Value: '1' },
    { Name: 'Second', Value: '2' },
    { Name: 'Third', Value: '3' },
    { Name: 'Fourth', Value: '4' }
  ];

  static getWeeklyFrequencyFromCronExpression(expression: string): DayOfWeek[] {
    const cronArray = expression.split(' ');
    if (!cronArray || cronArray.length !== 6) {
      return null;
    }
    const scheduledDays = cronArray[5].split(',');
    const days = scheduledDays
      .map(d => {
        return this.daysOfWeek.find(x => x.Value === d) ?? '';
      })
      .filter(x => x !== '');
    return orderBy(days, 'Order', 'asc');
  }

  static getMonthlyFrequencyFromCronExpression(expression: string): ScheduledMonthlyFrequency {
    const cronArray = expression.split(' ');
    if (!cronArray || cronArray.length !== 6) {
      return null;
    }
    const dayField = cronArray[5].split('#');
    if (!dayField || dayField.length !== 2) {
      return null;
    }
    const monthlyOccurrence = this.weeksOfMonth.find(x => x.Value === dayField[1])?.Name ?? '';
    const dayOfWeek = this.daysOfWeek.find(x => x.Value === dayField[0]) ?? '';
    if (monthlyOccurrence === '' || dayOfWeek === '') {
      return null;
    }

    return {
      ScheduledMonthlyOccurrence: monthlyOccurrence,
      ScheduledDayOfWeek: [dayOfWeek]
    };
  }

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

  static generateCronExpression(frequency: string, daysOfWeek: DayOfWeek[], monthlyOccurrence?: string): string {
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

  private static generateWeeklyCronExpression(daysOfWeek: DayOfWeek[]): string {
    if (!daysOfWeek?.length) {
      return '';
    }
    const defaultFields = this.getDefaultCronFields();
    const cronDaysOfWeek = daysOfWeek.map(x => {
      return this.daysOfWeek.find(d => d.Name === x.Name)?.Value ?? '';
    }).filter(x => x !== '');

    return cronDaysOfWeek?.length > 0
      ? `${defaultFields} ${cronDaysOfWeek.join(',')}`
      : '';
  }

  private static generateMonthlyCronExpression(monthlyOccurrence: string, dayOfWeek: DayOfWeek): string {
    if (!monthlyOccurrence?.length || !dayOfWeek.Name?.length) {
      return '';
    }
    const defaultFields = this.getDefaultCronFields();
    const cronOccurrence = this.weeksOfMonth.find(x => x.Name === monthlyOccurrence)?.Value ?? '';
    const cronDayOfWeek = this.daysOfWeek.find(d => d.Name === dayOfWeek.Name)?.Value ?? '';

    return cronOccurrence !== '' && cronDayOfWeek !== ''
      ? `${defaultFields} ${cronDayOfWeek}#${cronOccurrence}`
      : '';
  }

  private static getDefaultCronFields(): string {
    const sec = '*';
    const min = '*';
    const hour = '*';
    const dayOfMonth = '?';
    const month = '*';
    return `${sec} ${min} ${hour} ${dayOfMonth} ${month}`;
  }
}

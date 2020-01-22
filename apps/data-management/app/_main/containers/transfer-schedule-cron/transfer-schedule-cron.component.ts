import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

import {isObject, split} from 'lodash';

import * as fromCronHelpers from '../../helpers/cron-helper';

@Component({
  selector: 'pf-transfer-schedule-cron',
  templateUrl: './transfer-schedule-cron.component.html',
  styleUrls: ['./transfer-schedule-cron.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferScheduleCronComponent implements OnChanges {
  @Input() id: number;
  @Input() cronExpression: string;
  @Input() editMode: boolean;
  @Input() disabled: boolean;
  @Input() lastRunDate: string;
  @Output() cronExpressionChanges = new EventEmitter();
  private cronArray: string[] = [];

  dailyChecked = false;
  weeklyChecked = false;
  monthlyChecked = false;
  dayValue: string;
  monthlyWeekOfMonthValue: string;
  monthlyDayValue: string;

  defaultDay: { text: string, value: string } = { text: 'Select Day', value: null};
  defaultWeekOfMonth: { text: string, value: string };
  defaultDayOfWeek: { text: string, value: string };
  daysOfWeek = fromCronHelpers.daysOfWeek;
  weeksOfMonth = fromCronHelpers.weeksOfMonth;

  ngOnChanges(changes: SimpleChanges): void {
    if (isObject(changes.cronExpression) && changes.cronExpression.isFirstChange()) {
      this.parseCronExpression();
    }
    if (isObject(changes.disabled) && !changes.disabled.isFirstChange()) {
      this.enableExistingExpression();
    }
    if (isObject(changes.editMode) && !changes.editMode.isFirstChange()) {
      if (changes.editMode.currentValue === false) {
        this.parseCronExpression();
      }
    }
  }

  enableExistingExpression() {
    if (this.dailyChecked || this.weeklyChecked || this.monthlyChecked) {
      this.emitChange(true);
    }
  }

  emitChange(force: boolean) {
    this.cronExpressionChanges.emit({ expression: this.createCronExpression(), force: force });
  }

  parseCronExpression() {
    if (!this.cronExpression) {
      this.createNewCronExpression();
      return;
    }
    this.cronArray = split(this.cronExpression, ' ');
    if (this.cronArray.length !== 5) {
      this.createNewCronExpression();
      return;
    }

    this.dailyChecked = false;
    this.weeklyChecked = false;
    this.monthlyChecked = false;

    // check for daily
    if (fromCronHelpers.dailyCronExpression.test(this.cronExpression)) {
      this.dailyChecked = true;
    }
    // check for weekly
    if (fromCronHelpers.weeklyCronExpression.test(this.cronExpression)) {
      this.weeklyChecked = true;
      this.dayValue = this.cronArray[4];
      this.parseDayOfWeek(this.cronArray[4]);
    }
    // check for monthly
    if (fromCronHelpers.monthlyCronExpression.test(this.cronExpression)) {
      this.monthlyChecked = true;
      this.parseMonthly(this.cronArray[4]);
    }
  }

  createNewCronExpression() {
    // default to midnight, need other details
    this.cronArray = ['0', '0', '', '', ''];
  }

  handleClick(interval: string) {
    switch (interval) {
      case 'daily':
        this.setDaily();
        break;
      case 'weekly':
        this.setWeekly();
        break;
      case 'monthly':
        this.setMonthly();
        break;
    }
  }

  parseDayOfWeek(day: string) {
    this.defaultDay = this.daysOfWeek.find(s => s.value === day);
  }

  parseMonthly(expression: string) {
    const x = expression.split('#');
    this.monthlyDayValue = x[0];
    this.monthlyWeekOfMonthValue = x[1];
    this.defaultDayOfWeek = this.daysOfWeek.find(s => s.value === this.monthlyDayValue);
    this.defaultWeekOfMonth = this.weeksOfMonth.find(s => s.value === this.monthlyWeekOfMonthValue);
  }

  setDaily() {
    this.dailyChecked = true;
    this.weeklyChecked = false;
    this.monthlyChecked = false;
    this.cronArray = ['0', '0', '*', '*', '*'];
    this.emitChange(false);
  }

  setWeekly() {
    this.dailyChecked = false;
    this.weeklyChecked = true;
    this.monthlyChecked = false;
    this.cronArray = ['0', '0', '*', '*', null];
    if (this.dayValue) {
      this.cronArray[4] = this.dayValue;
    }
    this.emitChange(false);
  }

  setMonthly() {
    this.dailyChecked = false;
    this.weeklyChecked = false;
    this.monthlyChecked = true;
    this.cronArray = ['0', '0', '*', '*', null];
    this.monthChangeHandler();
  }

  itemDisabled(itemArgs: {dataItem: any, index: number}) {
    return itemArgs.dataItem.value === null;
  }

  dayOfWeekChange(v: { text: string, value: string }) {
    this.dayValue = v.value;
    this.cronArray = ['0', '0', '*', '*', v.value];
    this.emitChange(false);
  }

  createCronExpression(): string {
    return this.cronArray.join(' ');
  }

  weekOfMonthChange(v: { text: string, value: string }) {
    this.monthlyWeekOfMonthValue = v.value;
    this.monthChangeHandler();
  }

  dayOfMonthChange(v: { text: string, value: string }) {
    this.monthlyDayValue = v.value;
    this.monthChangeHandler();
  }

  monthChangeHandler() {
    if (!this.defaultDayOfWeek) {
      this.defaultDayOfWeek = this.daysOfWeek.find(d => d.value === '1');
    }
    if (!this.defaultWeekOfMonth) {
      this.defaultWeekOfMonth = this.daysOfWeek.find(d => d.value === '1');
    }

    const dv = this.monthlyDayValue ? this.monthlyDayValue : this.defaultDayOfWeek.value;
    const wv = this.monthlyWeekOfMonthValue ? this.monthlyWeekOfMonthValue : this.defaultWeekOfMonth.value;

    this.cronArray[4] = `${dv}#${wv}`;
    this.emitChange(false);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' } );
  }

  getWeeklyScheduleDetails(): string {
    return this.daysOfWeek.find(d => d.value === this.dayValue).text;
  }

  getMonthlyScheduleDetails(): string {
    return `${this.weeksOfMonth.find(d => d.value === this.monthlyWeekOfMonthValue).text}
            ${this.daysOfWeek.find(d => d.value === this.monthlyDayValue).text}`;
  }
}

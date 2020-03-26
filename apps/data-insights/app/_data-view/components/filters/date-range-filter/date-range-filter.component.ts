import { Component, Output, Input, EventEmitter } from '@angular/core';

import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';
import { addDays, isEqualDate } from '@progress/kendo-date-math';

import { FilterOperator, Between, IsBefore, IsAfter, Is } from '../../../models';

@Component({
  selector: 'pf-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss']
})
export class DateRangeFilterComponent {
  @Input() selectedOperator: FilterOperator;
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() locked: boolean;
  @Input() dateFormat: string;
  @Output() selectedOptionsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() selectedOperatorChanged: EventEmitter<FilterOperator> = new EventEmitter<FilterOperator>();

  betweenOperator: FilterOperator = Between;

  operators = [ Between, Is, IsAfter, IsBefore ];
  max: Date = new Date();

  constructor(private intlService: IntlService) {}

  public get selectionRange(): SelectionRange {
    return {
      start: this.startDate ? this.intlService.parseDate(this.startDate) : null,
      end: this.endDate ? this.intlService.parseDate(this.endDate) : null
    };
  }

  public get selectedDate(): Date {
    return (this.startDate ? this.intlService.parseDate(this.startDate) : null);
  }

  handleOperatorSelectionChanged(operator: FilterOperator): void {
    this.handleToggleDateRangeToDate(this.selectedOperator, operator);
    this.selectedOperator = operator;
    this.selectedOperatorChanged.emit(operator);
  }

  handleSelectionRangeChange(range: SelectionRange): void {
    if (!range.start || !range.end) {
      return;
    }
    if (isEqualDate(range.start, range.end)) {
      range.end = addDays(range.start, 1);
    }
    const startDate = this.getFormattedDateString(range.start);
    const endDate = this.getFormattedDateString(range.end);
    this.selectedOptionsChanged.emit([startDate, endDate]);
  }

  handleValueChanged(value: Date): void {
    if (!value) {
      return;
    }
    const selectedDate = this.getFormattedDateString(value);
    this.selectedOptionsChanged.emit([selectedDate]);
  }

  private handleToggleDateRangeToDate(previousOperator: FilterOperator, currentOperator: FilterOperator): void {
    if (!this.startDate || !this.endDate) {
      return;
    }
    if (previousOperator === this.betweenOperator && currentOperator !== this.betweenOperator) {
      this.handleValueChanged(this.selectedDate);
    }
  }

  private getFormattedDateString(date: Date): string {
    const isoDateString = date.toISOString();
    const year = isoDateString.substr(0, 4);
    const month = isoDateString.substr(5, 2);
    const day = isoDateString.substr(8, 2);
    return `${year}-${month}-${day}`;
  }
}

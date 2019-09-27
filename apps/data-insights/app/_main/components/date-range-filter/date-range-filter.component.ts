import { Component, Output, Input, EventEmitter } from '@angular/core';

import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';
import { addDays, isEqualDate } from '@progress/kendo-date-math';

import { FilterOperator, BetweenOperator } from '../../models';

@Component({
  selector: 'pf-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss']
})
export class DateRangeFilterComponent {
  @Input() selectedOperator: FilterOperator;
  @Input() startDate: string;
  @Input() endDate: string;
  @Output() selectionRangeChanged: EventEmitter<SelectionRange> = new EventEmitter<SelectionRange>();

  operators = [ BetweenOperator ];

  constructor(public intl: IntlService) {}

  public get selectionRange(): SelectionRange {
    return {
      start: this.startDate ? this.intl.parseDate(this.startDate) : null,
      end: this.endDate ? this.intl.parseDate(this.endDate) : null
    };
  }

  handleSelectionRangeChange(range: SelectionRange): void {
    if (!range.start || !range.end) {
      return;
    }
    if (isEqualDate(range.start, range.end)) {
      range.end = addDays(range.start, 1);
    }
    this.selectionRangeChanged.emit(range);
  }
}

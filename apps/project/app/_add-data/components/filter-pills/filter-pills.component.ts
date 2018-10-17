import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';
import * as cloneDeep from 'lodash.clonedeep';

import { arraySortByString, SortDirection } from 'libs/core/functions';

import { Filter, Filters, FilterType, Pill } from '../../models';
import { getFiltersWithValues } from '../../helpers';

@Component({
  selector: 'pf-filter-pills',
  templateUrl: './filter-pills.component.html',
  styleUrls: ['./filter-pills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPillsComponent implements OnInit, OnChanges {
  @Input() filters: Filter[];
  @Output() pillClicked = new EventEmitter<Pill>();

  pills: Pill[];
  ps: PerfectScrollbar;

  constructor() {}

  ngOnInit() {
    this.ps = new PerfectScrollbar('.pills-container');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filters) {
      this.buildPillsFromFilters(this.filters);

      if (this.ps) {
        // Pushing this to the end of the event queue to ensure the content has been drawn is overflowing
        // before calling perfect-scrollbar's update method. Otherwise race conditions can happen. [BC]
        window.setTimeout(() => this.ps.update());
      }
    }
  }

  pillTrackByFn(index, item: Pill) {
    return item.FilterName + item.ValueName;
  }

  handlePillClicked(pill: Pill) {
    if (!pill.Locked) {
      this.pillClicked.emit(pill);
    }
  }

  private buildPillsFromFilters(filters: Filter[]) {
    this.pills = [];

    getFiltersWithValues(filters).map((fwv: Filters) => {
      switch (fwv.Type) {
        case FilterType.Multi: {
          cloneDeep(fwv.Options)
            .sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending))
            .filter(o => o.Selected).map(opt => {
              this.pills.push({
                FilterId: fwv.Id,
                FilterName: fwv.DisplayName,
                ValueName: opt.Name,
                Value: opt.Value,
                Locked: fwv.Locked
              });
            });

          break;
        }
        case FilterType.Text: {
          this.pills.push({
            FilterId: fwv.Id,
            FilterName: fwv.DisplayName,
            ValueName: fwv.Value,
            Value: fwv.Value,
            Locked: fwv.Locked
          });

          break;
        }
        case FilterType.Range: {
          this.pills.push({
            FilterId: fwv.Id,
            FilterName: fwv.DisplayName,
            ValueName: `${fwv.SelectedMinValue.toFixed(fwv.Precision)} - ${fwv.SelectedMaxValue.toFixed(fwv.Precision)}`,
            Value: null,
            Locked: fwv.Locked
          });

          break;
        }
      }
    });
  }
}

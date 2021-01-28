import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { arraySortByString, SortDirection } from 'libs/core/functions';

import { Filter, Filters, isMultiFilter, isRangeFilter, MultiSelectFilter, Pill, PillGroup, RangeFilter } from '../../models';
import { FiltersHelper } from '../../helpers';

@Component({
  selector: 'pf-filter-pills',
  templateUrl: './filter-pills.component.html',
  styleUrls: ['./filter-pills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPillsComponent implements OnChanges {
  @Input() filters: Filter[];
  @Output() clearPill = new EventEmitter<Pill>();
  @Output() clearPillGroup = new EventEmitter<PillGroup>();
  @ViewChild(PerfectScrollbarDirective, { static: true }) psDirectiveRef?: PerfectScrollbarDirective;

  pillGroups: PillGroup[];
  private previewStringLength = 40;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filters) {
      this.buildPillGroups(this.filters);
      this.psDirectiveRef.update();
    }
  }

  pillGroupTrackByFn(index, item: PillGroup) {
    return item.GroupName;
  }

  handlePillClicked(pill: Pill) {
    this.clearPill.emit(pill);
  }

  handleClearAllClicked(pillGroup: PillGroup) {
    this.clearPillGroup.emit(pillGroup);
  }

  private buildPillGroups(filters: Filter[]) {
    this.pillGroups = [];

    FiltersHelper.getFiltersWithValues(filters)
      .sort((a, b) => a.Order - b.Order)
      .map((filter: Filters) => {
      let pillGroup;

      if (isMultiFilter(filter)) {
        pillGroup = this.buildMultiSelectPillGroup(filter);
      } else if (isRangeFilter(filter)) {
        pillGroup = this.buildRangePillGroup(filter);
      }

      if (pillGroup) {
        this.pillGroups.push(pillGroup);
      }
    });
  }

  private buildMultiSelectPillGroup(filter: MultiSelectFilter): PillGroup {
    const pillGroup = this.buildPillGroupBaseInfo(filter);

    const selectedOptions =
      cloneDeep(filter.Options)
      .sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending))
      .filter(o => o.Selected);

    const commaSeparatedOptions = selectedOptions.map(o => o.Name).join(', ');

    pillGroup.PreviewString = commaSeparatedOptions.length > this.previewStringLength
      ? `${commaSeparatedOptions.substr(0, this.previewStringLength)}...`
      : commaSeparatedOptions;

    pillGroup.Pills = selectedOptions.map(opt => {
      return {
        FilterId: filter.Id,
        ValueName: opt.Name,
        Value: opt.Value
      };
    });

    return pillGroup;
  }

  private buildRangePillGroup(filter: RangeFilter): PillGroup {
    const pillGroup = this.buildPillGroupBaseInfo(filter);
    const valueDisplay = `${filter.SelectedMinValue.toFixed(filter.Precision)} - ${filter.SelectedMaxValue.toFixed(filter.Precision)}`;

    pillGroup.PreviewString = valueDisplay;
    pillGroup.Pills = [{
      FilterId: filter.Id,
      ValueName: valueDisplay,
      Value: null
    }];

    return pillGroup;
  }


  private buildPillGroupBaseInfo(filter: Filter): PillGroup {
    return{
      FilterId: filter.Id,
      GroupName: filter.DisplayName,
      Locked: filter.Locked,
      PreviewString: '',
      Pills: []
    };
  }
}

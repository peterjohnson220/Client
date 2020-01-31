import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MultiSelectFilterComponent} from '../multi-select-filter';
import {Filter, FilterableMultiSelectFilter, FilterableMultiSelectOption, MultiSelectFilter, MultiSelectOption} from '../../../models';
import {faFilter} from '@fortawesome/pro-solid-svg-icons';
import * as fromSearchPageActions from '../../../actions/search-page.actions';
import * as fromSingledFilterActions from '../../../actions/singled-filter.actions';

@Component({
  selector: 'pf-filterable-multi-select-filter',
  templateUrl: './filterable-multi-select-filter.component.html',
  styleUrls: ['./filterable-multi-select-filter.component.scss']
})
export class FilterableMultiSelectFilterComponent extends MultiSelectFilterComponent {
  @Input() filter: FilterableMultiSelectFilter;
  @Output() optionSelected: EventEmitter<{filterId: string, option: FilterableMultiSelectOption}> = new EventEmitter();
  @Output() subFilterSelected: EventEmitter<{filter: Filter, optionValue: any}> = new EventEmitter();

  faFilter = faFilter;

  optionDisabled(option: FilterableMultiSelectOption) {
    return (!option.Selected && option.Count === 0) || this.filter.Locked;
  }

  handleFilterableOptionSelected(filter: Filter, option: FilterableMultiSelectOption, filterClicked: boolean) {
    // filter clicked event
    if (filterClicked) {
      this.subFilterSelected.emit({filter: filter, optionValue: option.Value});
    // option clicked event
    } else {
      const filterId = filter.Id;
      if (this.optionDisabled(option)) {
        return;
      }
      this.optionSelected.emit({ filterId, option });
    }
  }


}

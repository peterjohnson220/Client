import {Component, Input} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';

import { SingleFilterComponent } from '../single-filter';
import { MultiSelectOption } from '../../models';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromChildFilterActions from '../../actions/child-filter.actions';
import * as fromSearchReducer from '../../reducers';

@Component({
  selector: 'pf-child-filter',
  templateUrl: './child-filter.component.html',
  styleUrls: ['./child-filter.component.scss']
})
export class ChildFilterComponent extends SingleFilterComponent {
  @Input() displayDescriptions = false;
  childFilterParentOptionValue$: Observable<string>;
  childFilterName$: Observable<string>;

  constructor(store: Store<fromSearchReducer.State>) {
    super(store);

    this.scrollId = ScrollIdConstants.SEARCH_CHILD_FILTER;
    this.filter$ = <any>this.store.select(fromSearchReducer.getChildFilter);
    this.selectionCount$ = this.store.select(fromSearchReducer.getChildFilterSelectionCount);
    this.searchValue$ = this.store.select(fromSearchReducer.getChildFilterSearchValue);
    this.childFilterParentOptionValue$ = this.store.select(fromSearchReducer.getChildFilterParentOptionValue);
    this.childFilterName$ = this.store.select(fromSearchReducer.getChildFilterName);
  }

  handleMultiSelectOptionSelected(optionSelectedObj: { filterId: string, option: MultiSelectOption}) {
    this.store.dispatch(new fromChildFilterActions.ToggleMultiSelectOption(optionSelectedObj));
    this.store.dispatch(new fromSearchFiltersActions.ToggleMultiSelectOption(optionSelectedObj));
  }

  handleClearSection(filterId: string) {
    let parentOptionValue = '';
    this.childFilterParentOptionValue$.pipe(take(1)).subscribe( x => {
        parentOptionValue = x;
      }
    );

    this.store.dispatch(new fromSearchFiltersActions.ClearFilter({filterId: filterId, parentOptionValue: parentOptionValue}));
    this.store.dispatch(new fromChildFilterActions.ClearSelections());
  }

  handleSearchValueChanged(value: string) {
    this.store.dispatch(new fromChildFilterActions.SetSearchValue(value));
    this.load();
  }

}

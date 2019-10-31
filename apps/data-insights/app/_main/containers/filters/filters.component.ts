import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromFiltersActions from '../../actions/filters.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Filter, Field, GetFilterOptionsData, generateDefaultFilter } from '../../models';

@Component({
  selector: 'pf-data-view-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  pendingFilters$: Observable<Filter[]>;
  filtersValid$: Observable<boolean>;
  activeFiltersCount$: Observable<number>;
  selectedFields$: Observable<Field[]>;

  pendingFiltersSub: Subscription;
  activeFiltersCountSub: Subscription;
  selectedFieldsSub: Subscription;

  changesMade = false;
  pendingFilters: Filter[];
  activeFiltersCount: number;
  selectedFields: Field[];

  constructor(
    public store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.pendingFilters$ = this.store.pipe(select(fromDataInsightsMainReducer.getPendingFilters));
    this.filtersValid$ = this.store.pipe(select(fromDataInsightsMainReducer.getPendingFiltersValid));
    this.activeFiltersCount$ = this.store.pipe(select(fromDataInsightsMainReducer.getActiveFiltersCount));
    this.selectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
  }

  ngOnInit(): void {
    this.pendingFiltersSub = this.pendingFilters$.subscribe(filters => this.pendingFilters = filters);
    this.activeFiltersCountSub = this.activeFiltersCount$.subscribe(count => this.activeFiltersCount = count);
    this.selectedFieldsSub = this.selectedFields$.subscribe(fields => this.selectedFields = fields);
  }

  ngOnDestroy(): void {
    this.pendingFiltersSub.unsubscribe();
    this.activeFiltersCountSub.unsubscribe();
    this.selectedFieldsSub.unsubscribe();
  }

  trackByFn(index: any, filter: Filter): number {
    return filter.Field.DataElementId;
  }

  handleAddFilterClicked(): void {
    if (!this.selectedFields) {
      return;
    }
    const filter: Filter = generateDefaultFilter(this.selectedFields[0]);
    this.store.dispatch(new fromFiltersActions.AddFilter(filter));
  }

  handleFilterChanged(index: number, filter: Filter): void {
    this.store.dispatch(new fromFiltersActions.UpdateFilter({ index, filter }));
    this.changesMade = true;
  }

  handleSearchOptionChanged(data: GetFilterOptionsData): void {
    this.store.dispatch(new fromFiltersActions.GetFilterOptions(data));
  }

  handleDeleteFilter(index: number): void {
    this.store.dispatch(new fromFiltersActions.RemovePendingFilterByIndex({ index }));
    if (index < this.activeFiltersCount) {
      this.store.dispatch(new fromFiltersActions.RemoveActiveFilterByIndex({ index }));
    }
  }

  handleApplyFilterClicked(): void {
    this.store.dispatch(new fromFiltersActions.ApplyFilters());
    this.changesMade = false;
  }
}


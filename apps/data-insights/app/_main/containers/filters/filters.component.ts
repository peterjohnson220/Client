import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromConfigurationActions from '../../actions/configuration.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Filter, Field, GetFilterOptionsData, generateDefaultFilter } from '../../models';

@Component({
  selector: 'pf-data-view-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Input() selectedFields: Field[];

  pendingFilters$: Observable<Filter[]>;
  filtersValid$: Observable<boolean>;
  activeFiltersCount$: Observable<number>;

  pendingFiltersSub: Subscription;
  activeFiltersCountSub: Subscription;
  changesMade = false;

  pendingFilters: Filter[];
  activeFiltersCount: number;

  constructor(
    public store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.pendingFilters$ = this.store.pipe(select(fromDataInsightsMainReducer.getPendingFilters));
    this.filtersValid$ = this.store.pipe(select(fromDataInsightsMainReducer.getPendingFiltersValid));
    this.activeFiltersCount$ = this.store.pipe(select(fromDataInsightsMainReducer.getActiveFiltersCount));
  }

  ngOnInit(): void {
    this.pendingFiltersSub = this.pendingFilters$.subscribe(filters => this.pendingFilters = filters);
    this.activeFiltersCountSub = this.activeFiltersCount$.subscribe(count => this.activeFiltersCount = count);
  }

  ngOnDestroy(): void {
    this.pendingFiltersSub.unsubscribe();
    this.activeFiltersCountSub.unsubscribe();
  }

  trackByFn(index: any, field: Field): number {
    return field.DataElementId;
  }

  handleAddFilterClicked(): void {
    if (!this.selectedFields) {
      return;
    }
    const filter: Filter = generateDefaultFilter(this.selectedFields[0]);
    this.store.dispatch(new fromConfigurationActions.AddFilter(filter));
  }

  handleFilterChanged(index: number, filter: Filter): void {
    this.store.dispatch(new fromConfigurationActions.UpdateFilter({ index, filter }));
    this.changesMade = true;
  }

  handleSearchOptionChanged(data: GetFilterOptionsData): void {
    this.store.dispatch(new fromConfigurationActions.GetFilterOptions(data));
  }

  handleDeleteFilter(index: number): void {
    this.store.dispatch(new fromConfigurationActions.RemovePendingFilterByIndex({ index }));
    if (index < this.activeFiltersCount) {
      this.store.dispatch(new fromConfigurationActions.RemoveActiveFilterByIndex({ index }));
    }
  }

  handleApplyFilterClicked(): void {
    this.store.dispatch(new fromConfigurationActions.ApplyFilters());
    this.changesMade = false;
  }
}


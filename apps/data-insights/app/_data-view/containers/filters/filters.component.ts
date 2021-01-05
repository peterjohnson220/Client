import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Field, FieldType, Filter, generateDefaultFilter, GetFilterOptionsData } from 'libs/ui/formula-editor';

import * as fromFiltersActions from '../../actions/filters.actions';
import * as fromDataInsightsMainReducer from '../../reducers';

@Component({
  selector: 'pf-data-view-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  pendingFilters$: Observable<Filter[]>;
  activeFilters$: Observable<Filter[]>;
  filtersValid$: Observable<boolean>;
  selectedFields$: Observable<Field[]>;

  pendingFiltersSub: Subscription;
  activeFiltersSub: Subscription;
  selectedFieldsSub: Subscription;

  changesMade = false;
  pendingFilters: Filter[];
  activeFilters: Filter[];
  activeFiltersCount: number;
  availableFieldsForFilters: Field[] = [];

  constructor(
    public store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.pendingFilters$ = this.store.pipe(select(fromDataInsightsMainReducer.getPendingFilters));
    this.activeFilters$ = this.store.pipe(select(fromDataInsightsMainReducer.getActiveFilters));
    this.filtersValid$ = this.store.pipe(select(fromDataInsightsMainReducer.getPendingFiltersValid));
    this.selectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
  }

  ngOnInit(): void {
    this.pendingFiltersSub = this.pendingFilters$.subscribe(filters => this.pendingFilters = filters);
    this.activeFiltersSub = this.activeFilters$.subscribe(filters => {
      this.activeFilters = filters || [];
      this.activeFiltersCount = this.activeFilters.length;
      this.setAvailableFields(this.availableFieldsForFilters);
    });
    this.selectedFieldsSub = this.selectedFields$.subscribe(fields => {
      this.setAvailableFields(fields);
    });
  }

  ngOnDestroy(): void {
    this.pendingFiltersSub.unsubscribe();
    this.activeFiltersSub.unsubscribe();
    this.selectedFieldsSub.unsubscribe();
  }

  trackByFn(index: any, filter: Filter): number {
    return filter.Field.DataElementId;
  }

  handleAddFilterClicked(): void {
    if (!this.availableFieldsForFilters) {
      return;
    }
    const filter: Filter = generateDefaultFilter(this.availableFieldsForFilters[0]);
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

  private existsInLockedFilter(field: Field): boolean {
    if (field.FieldType === FieldType.DataElement) {
      return this.activeFilters.some(a => a.IsLocked && a.Field.DataElementId === field.DataElementId);
    }
    return this.activeFilters.some(a => a.IsLocked && a.Field.FormulaId === field.FormulaId);
  }

  private setAvailableFields(fields: Field[]) {
    this.availableFieldsForFilters = fields.filter(f => !this.existsInLockedFilter(f));
  }
}


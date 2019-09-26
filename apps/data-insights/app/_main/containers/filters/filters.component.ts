import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromConfigurationActions from '../../actions/configuration.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Filter, Field, GetFilterOptionsData, getDefaultOperatorByDataType } from '../../models';
import * as fromDataViewGridActions from '../../actions/data-view-grid.actions';

@Component({
  selector: 'pf-data-view-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Input() selectedFields: Field[];

  filters$: Observable<Filter[]>;
  filtersValid$: Observable<boolean>;

  filtersSub: Subscription;
  changesMade = false;

  filters: Filter[];

  constructor(
    public store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.filters$ = this.store.pipe(select(fromDataInsightsMainReducer.getFilters));
    this.filtersValid$ = this.store.pipe(select(fromDataInsightsMainReducer.getFiltersValid));
  }

  ngOnInit(): void {
    this.filtersSub = this.filters$.subscribe(filters => this.filters = filters);
  }

  ngOnDestroy(): void {
    this.filtersSub.unsubscribe();
  }

  trackByFn(index: any, field: Field): number {
    return field.DataElementId;
  }

  handleAddFilterClicked(): void {
    if (!this.selectedFields) {
      return;
    }
    const filter: Filter = {
      Field: this.selectedFields[0],
      Operator: getDefaultOperatorByDataType(this.selectedFields[0]),
      Options: [],
      SelectedOptions: []
    };
    this.store.dispatch(new fromConfigurationActions.AddFilter(filter));
  }

  handleSelectedFieldChanged(index: number, field: Field): void {
    this.store.dispatch(new fromConfigurationActions.UpdateFilterSelectedField({ index, field }));
  }

  handleSearchOptionChanged(data: GetFilterOptionsData): void {
    this.store.dispatch(new fromConfigurationActions.GetFilterOptions(data));
  }

  handleSelectedValuesChanged(index: number, selectedValues: string[]): void {
    this.store.dispatch(new fromConfigurationActions.UpdateFilterSelectedOptions({ index, selectedOptions: selectedValues }));
    this.changesMade = true;
  }

  handleDeleteFilter(field: Field): void {
    this.store.dispatch(new fromConfigurationActions.RemoveFilter(field));
    this.store.dispatch(new fromDataViewGridActions.GetData());
  }

  handleApplyFilterClicked(): void {
    this.store.dispatch(new fromConfigurationActions.ApplyFilters(this.filters));
    this.changesMade = false;
  }
}


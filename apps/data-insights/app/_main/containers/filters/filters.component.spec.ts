import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromFiltersActions from '../../actions/filters.actions';
import { FiltersComponent } from './filters.component';
import { generateMockField, Field, Filter, getDefaultOperatorByDataType, GetFilterOptionsData, generateMockFilter } from '../../models';

describe('Data Insights - Filters Comopnent', () => {
  let instance: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers)
        })
      ],
      declarations: [ FiltersComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FiltersComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    fixture.detectChanges();
  });

  it('should dispatch AddFilter with default filter when handling add filter clicked', () => {
    const firstSelectedfield: Field = generateMockField();
    const filter: Filter = {
      Field: firstSelectedfield,
      Operator: getDefaultOperatorByDataType(firstSelectedfield),
      Options: [],
      SelectedOptions: [],
      IsValid: false
    };
    instance.selectedFields = [firstSelectedfield];
    const expectedAction = new fromFiltersActions.AddFilter(filter);
    spyOn(store, 'dispatch');

    instance.handleAddFilterClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch UpdateFilter with correct data when handling filter changed', () => {
    spyOn(store, 'dispatch');
    const filter: Filter = generateMockFilter();
    const filterIndex = 2;
    const data = {
      index: filterIndex,
      filter
    };
    const expectedAction = new fromFiltersActions.UpdateFilter(data);

    instance.handleFilterChanged(filterIndex, filter);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetFilterOptions with correct data when handling search options changed', () => {
    spyOn(store, 'dispatch');
    const data: GetFilterOptionsData = {
      FilterIndex: 2,
      Query: 'Acc',
      EntitySourceName: 'CompanyJobs',
      SourceName: 'Job_Title'
    };
    const expectedAction = new fromFiltersActions.GetFilterOptions(data);

    instance.handleSearchOptionChanged(data);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch RemovePendingFilterByIndex with correct index when handling delete filter', () => {
    spyOn(store, 'dispatch');
    const filterIndex = 2;
    const expectedAction = new fromFiltersActions.RemovePendingFilterByIndex({ index: filterIndex });

    instance.handleDeleteFilter(filterIndex);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch RemoveActiveFilterByIndex if index is in the range when handling delete filter', () => {
    spyOn(store, 'dispatch');
    const filterIndex = 2;
    const expectedAction = new fromFiltersActions.RemoveActiveFilterByIndex({ index: filterIndex });
    instance.activeFiltersCount = 3;

    instance.handleDeleteFilter(filterIndex);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch RemoveActiveFilterByIndex if index is out of range when handling delete filter', () => {
    spyOn(store, 'dispatch');
    const filterIndex = 3;
    const expectedAction = new fromFiltersActions.RemoveActiveFilterByIndex({ index: filterIndex });
    instance.activeFiltersCount = 3;

    instance.handleDeleteFilter(filterIndex);

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch ApplyFilters when handling apply filters clicked', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromFiltersActions.ApplyFilters();

    instance.handleApplyFilterClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});

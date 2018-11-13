import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromSearchResultsActions from '../../actions/search-results.actions';
import * as fromSavedFiltersActions from '../../actions/saved-filters.actions';
import * as fromSharedSearchReducer from '../../reducers';
import { ResultsHeaderComponent } from './results-header.component';
import { Filter, generateMockMultiSelectFilter, generateMockPill, generateMockPillGroup,
        generateMockSavedFilter } from '../../models';

describe('Project - Add Data - Results Header', () => {
  let fixture: ComponentFixture<ResultsHeaderComponent>;
  let instance: ResultsHeaderComponent;
  let store: Store<fromSharedSearchReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_shared: combineReducers(fromSharedSearchReducer.reducers),
        })
      ],
      declarations: [
        ResultsHeaderComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(ResultsHeaderComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch a ResetAllFilters action, when handling a reset click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSearchFiltersActions.ResetAllFilters();

    instance.handleResetClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ClearDataCutSelections action, when handling a reset click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSearchResultsActions.ClearDataCutSelections();

    instance.handleResetClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a RemoveFilterValue action for search filters, when handling a clear pill', () => {
    spyOn(store, 'dispatch');
    const pill = generateMockPill();
    const expectedAction = new fromSearchFiltersActions.RemoveFilterValue({filterId: pill.FilterId, value: pill.Value});

    instance.handleClearPill(pill);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a RemoveFilterValue action for the singled filter, when handling a clear pill', () => {
    spyOn(store, 'dispatch');
    const pill = generateMockPill();
    const expectedAction = new fromSingledFilterActions.RemoveFilterValue({value: pill.Value});

    instance.handleClearPill(pill);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ClearFilter action for search filters, when handling a clear pill group', () => {
    spyOn(store, 'dispatch');
    const pillGroup = generateMockPillGroup();
    const expectedAction = new fromSearchFiltersActions.ClearFilter({filterId: pillGroup.FilterId});

    instance.handleClearPillGroup(pillGroup);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ClearSelections action for the singled filter, when handling a clear pill group', () => {
    spyOn(store, 'dispatch');
    const pillGroup = generateMockPillGroup();
    const expectedAction = new fromSingledFilterActions.ClearSelections();

    instance.handleClearPillGroup(pillGroup);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should know when we have a set of filters that contains more than just locked filters', () => {
    instance.hasNonLockedFilters = false;
    const lockedFilter = <Filter>{...generateMockMultiSelectFilter(), Locked: false };

    store.dispatch(new fromSearchFiltersActions.AddFilters([lockedFilter]));

    expect(instance.hasNonLockedFilters).toBe(true);
  });

  it('should know when we have a selected saved filter', () => {
    instance.hasSelectedSavedFilter = false;

    store.dispatch(new fromSavedFiltersActions.GetSavedFiltersSuccess([generateMockSavedFilter()]));

    expect(instance.hasSelectedSavedFilter).toBe(true);
  });
});

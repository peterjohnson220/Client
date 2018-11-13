import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSearchActions from '../../actions/search.actions';
import { Filter, generateMockJobContext, generateMockMultiSelectOption, generateMockTextFilter } from '../../models';
import * as fromSharedSearchReducer from '../../reducers';
import { SearchFiltersComponent } from './search-filters.component';

describe('Project - Add Data - Search Filters', () => {
  let fixture: ComponentFixture<SearchFiltersComponent>;
  let instance: SearchFiltersComponent;
  let store: Store<fromSharedSearchReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_shared: combineReducers(fromSharedSearchReducer.reducers)
        })
      ],
      declarations: [
        SearchFiltersComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(SearchFiltersComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch a UpdateFilterValue action, when handling a value changed', () => {
    const filterValueObj = { filterId: 'jobTitleCode', value: 'New Value'};
    const expectedAction = new fromSearchFiltersActions.UpdateFilterValue(filterValueObj);
    spyOn(store, 'dispatch');

    instance.handleValueChanged(filterValueObj.filterId, filterValueObj.value);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should return the filter id for tracking purposes ', () => {
    const filter: Filter = generateMockTextFilter();

    const filterId = instance.trackByFilterId(5, filter);

    expect(filterId).toBe(filter.Id);
  });

  it('should dispatch a ToggleMultiSelectOption action, when handling a multi select option selected', () => {
    const idObj = { filterId: '329048', option: generateMockMultiSelectOption()};
    const expectedAction = new fromSearchFiltersActions.ToggleMultiSelectOption(idObj);
    spyOn(store, 'dispatch');

    instance.handleMultiSelectOptionSelected(idObj);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should set the focused filter to jobTitleCode anytime the page is shown', () => {
    store.dispatch(new fromSearchActions.SetJobContext(generateMockJobContext()));

    expect(instance.focusedFilter).toBe('jobTitleCode');
  });

  it('should set the focused filter to the filterId when handling a clear section', () => {
    const filterId = 'iAmAFilterId';

    instance.handleClearSection(filterId);

    expect(instance.focusedFilter).toBe(filterId);
  });

  it('should should dispatch a ClearFilter action with the filterId, when handling a clear section', () => {
    const filterId = 'iAmAFilterId';
    const expectedAction = new fromSearchFiltersActions.ClearFilter({filterId: filterId});
    spyOn(store, 'dispatch');

    instance.handleClearSection(filterId);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});

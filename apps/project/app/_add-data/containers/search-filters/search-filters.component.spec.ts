import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import { Filter, generateMockFilter } from '../../models';
import * as fromAddDataReducer from '../../reducers';
import { SearchFiltersComponent } from './search-filters.component';

describe('Project - Add Data - Search Filters', () => {
  let fixture: ComponentFixture<SearchFiltersComponent>;
  let instance: SearchFiltersComponent;
  let store: Store<fromAddDataReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addData: combineReducers(fromAddDataReducer.reducers),
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
  });

  it('should dispatch a UpdateFilterValue action, when handling a value changed', () => {
    const filterValueObj = { Id: 'jobTitleCode', Value: 'New Value'};
    const expectedAction = new fromSearchFiltersActions.UpdateFilterValue(filterValueObj);
    spyOn(store, 'dispatch');

    instance.handleValueChanged(filterValueObj.Id, filterValueObj.Value);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should return the filter id for tracking purposes ', () => {
    const filter: Filter = generateMockFilter();

    const filterId = instance.trackByFilterId(5, filter);

    expect(filterId).toBe(filter.id);
  });
});

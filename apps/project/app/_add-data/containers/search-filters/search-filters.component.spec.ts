import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import { StaticFilterValue } from '../../models';
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

  it('should dispatch a UpdateStaticFilterValue action, when handling a value changed', () => {
    const staticFilterValue: StaticFilterValue = { Field: 'jobTitleCode', Value: 'New Value'};
    const expectedAction = new fromSearchFiltersActions.UpdateStaticFilterValue(staticFilterValue);
    spyOn(store, 'dispatch');

    instance.handleValueChanged(staticFilterValue.Field, staticFilterValue.Value);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});

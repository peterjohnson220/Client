import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromSearchActions from '../../actions/search.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromAddDataReducer from '../../reducers';
import { SingleFilterComponent } from './single-filter.component';
import { generateMockMultiSelectOption } from '../../models';

describe('Project - Add Data - Single Filter', () => {
  let fixture: ComponentFixture<SingleFilterComponent>;
  let instance: SingleFilterComponent;
  let store: Store<fromAddDataReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addData: combineReducers(fromAddDataReducer.reducers)
        })
      ],
      declarations: [ SingleFilterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SingleFilterComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should dispatch a SearchAggregation action upon init', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSingledFilterActions.SearchAggregation();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ToggleFilterSearch action when going back to all filters', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSearchActions.ToggleFilterSearch();

    instance.backToAllFilters();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ToggleMultiSelectOption action for the singled filter', () => {
    spyOn(store, 'dispatch');
    const optionSelectedObj = { filterId: 'blah', option: generateMockMultiSelectOption() };
    const expectedAction = new fromSingledFilterActions.ToggleMultiSelectOption(optionSelectedObj);

    instance.handleMultiSelectOptionSelected(optionSelectedObj);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ToggleMultiSelectOption action for the search filters when handling an option selected', () => {
    spyOn(store, 'dispatch');
    const optionSelectedObj = { filterId: 'blah', option: generateMockMultiSelectOption() };
    const expectedAction = new fromSearchFiltersActions.ToggleMultiSelectOption(optionSelectedObj);

    instance.handleMultiSelectOptionSelected(optionSelectedObj);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ClearFilter action for the search filters when handling a clear section', () => {
    spyOn(store, 'dispatch');
    const filterId = 'blah';
    const expectedAction = new fromSearchFiltersActions.ClearFilter(filterId);

    instance.handleClearSection(filterId);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ClearSelections action for the singled filter when handling a clear section', () => {
    spyOn(store, 'dispatch');
    const filterId = 'blah';
    const expectedAction = new fromSingledFilterActions.ClearSelections();

    instance.handleClearSection(filterId);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a SearchAggregation action for the singled filter when handling a search value changed', () => {
    spyOn(store, 'dispatch');
    const searchValue = 'Finance';
    const expectedAction = new fromSingledFilterActions.SearchAggregation(searchValue);

    instance.handleSearchValueChanged(searchValue);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});

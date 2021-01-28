import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import * as fromInfiniteScrollActions from 'libs/features/search/infinite-scroll/actions/infinite-scroll.actions';

import * as fromSearchPageActions from '../../actions/search-page.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromSearchReducer from '../../reducers';
import { SingleFilterComponent } from './single-filter.component';
import { generateMockMultiSelectOption } from '../../models';

describe('Search Feature - Single Filter', () => {
  let fixture: ComponentFixture<SingleFilterComponent>;
  let instance: SingleFilterComponent;
  let store: Store<fromSearchReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_search: combineReducers(fromSearchReducer.reducers)
        })
      ],
      declarations: [ SingleFilterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SingleFilterComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should dispatch a SearchAggregation action upon init', () => {
    spyOn(store, 'dispatch');
    // TODO: Should this be load more?
    const scrollPayload = {
      scrollId: ScrollIdConstants.SEARCH_SINGLED_FILTER
    };
    const expectedAction = new fromInfiniteScrollActions.Load(scrollPayload);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ToggleFilterSearch action when going back to all filters', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSearchPageActions.ToggleFilterSearch();

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
    const expectedAction = new fromSearchFiltersActions.ClearFilter({filterId: filterId});

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
    // TODO: Should this be load more?
    const scrollPayload = {
      scrollId: ScrollIdConstants.SEARCH_SINGLED_FILTER
    };
    const expectedAction = new fromInfiniteScrollActions.Load(scrollPayload);

    instance.handleSearchValueChanged(searchValue);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});

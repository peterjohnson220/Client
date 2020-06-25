import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromSearchResultsActions from '../../actions/search-results.actions';
import * as fromSearchReducer from '../../reducers';
import { SearchResultsComponent } from './search-results.component';

describe('Search Feature - Search Results', () => {
  let fixture: ComponentFixture<SearchResultsComponent>;
  let instance: SearchResultsComponent;
  let store: Store<fromSearchReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_search: combineReducers(fromSearchReducer.reducers)
        })
      ],
      declarations: [
        SearchResultsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(SearchResultsComponent);
    instance = fixture.componentInstance;
  });

  it('should show a message, when loading more results', () => {
    store.dispatch(new fromSearchResultsActions.GetResultsSuccess({ totalRecordCount: 100 }));
    store.dispatch(new fromSearchResultsActions.GetMoreResults());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a GetMoreResults action onScroll when not already loading more results and it has results on the server', () => {
    store.dispatch(new fromSearchResultsActions.GetResultsSuccess({ totalRecordCount: 100 }));
    const expectedAction = new fromSearchResultsActions.GetMoreResults();
    spyOn(store, 'dispatch');
    instance.numberOfCurrentResults = 15;

    fixture.detectChanges();
    instance.onScroll();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should Not dispatch a GetMoreResults action onScroll when already loading more results', () => {
    store.dispatch(new fromSearchResultsActions.GetResultsSuccess({ totalRecordCount: 100 }));
    const getMoreResultsAction = new fromSearchResultsActions.GetMoreResults();

    store.dispatch(getMoreResultsAction);
    spyOn(store, 'dispatch');

    fixture.detectChanges();
    instance.onScroll();

    expect(store.dispatch).not.toHaveBeenCalledWith(getMoreResultsAction);
  });

  it('should Not dispatch a GetMoreResults action onScroll when there is no more results on the server', () => {
    const getMoreResultsAction = new fromSearchResultsActions.GetMoreResults();
    store.dispatch(new fromSearchResultsActions.GetResultsSuccess({ totalRecordCount: 100 }));

    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.onScroll();

    expect(store.dispatch).not.toHaveBeenCalledWith(getMoreResultsAction);
  });
});

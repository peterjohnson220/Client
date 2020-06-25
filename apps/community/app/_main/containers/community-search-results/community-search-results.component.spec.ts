import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';

import * as fromCommunitySearchActions from '../../actions/community-search.actions';

import { CommunitySearchResultsComponent } from './community-search-results.component';
import * as fromRootState from 'libs/state/state';
import { CommunitySearchDurationEnum, CommunitySearchSortByEnum } from 'libs/models/community/community-constants.model';
import { CommunitySearchQuery } from 'libs/models/community/community-search-query.model';

describe('CommunitySearchResultsComponent', () => {
  let fixture: ComponentFixture<CommunitySearchResultsComponent>;
  let instance: CommunitySearchResultsComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [ CommunitySearchResultsComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunitySearchResultsComponent);
    instance = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should dispatch SearchingCommunity when calling executeSearch', () => {
    const searchQuery = 'searchQuery';
    const searchDuration = CommunitySearchDurationEnum.AllTime;
    const searchSort = CommunitySearchSortByEnum.Relevance;

    const expectedAction = new fromCommunitySearchActions.SearchingCommunity({
      searchTerm: searchQuery,
      searchSort: searchSort,
      searchDuration: searchDuration
    });

    instance.executeSearch({
      searchTerm: searchQuery,
      searchSort: searchSort,
      searchDuration: searchDuration
    });

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch GettingMoreCommunitySearchResults onScrollDown with more results true and not loading', () => {
    const searchQuery = 'searchQuery';
    instance.query = searchQuery;
    instance.searchSort = CommunitySearchSortByEnum.Relevance;
    instance.searchDuration = CommunitySearchDurationEnum.AllTime;
    instance.hasMoreResultsOnServer = true;
    instance.loadingMoreSearchResults = false;

    const expectedAction =
      new fromCommunitySearchActions.GettingMoreCommunitySearchResults({
        searchTerm: searchQuery,
        searchSort: instance.searchSort,
        searchDuration: instance.searchDuration
      });

    instance.onScrollDown();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should not dispatch GettingMoreCommunitySearchResults if still loading more results', () => {
    instance.query = 'test';
    instance.hasMoreResultsOnServer = true;
    instance.loadingMoreSearchResults = true;

    instance.onScrollDown();

    expect(store.dispatch).toBeCalledTimes(0);
  });

  it('should not dispatch GettingMoreCommunitySearchResults onScrollDown with no more results and not loading', () => {
    instance.query = 'test';
    instance.hasMoreResultsOnServer = false;
    instance.loadingMoreSearchResults = false;

    instance.onScrollDown();

    expect(store.dispatch).toBeCalledTimes(0);
  });

  it('should not dispatch GettingMoreCommunitySearchResults onScrollDown without query', () => {
    instance.query = '';
    instance.hasMoreResultsOnServer = true;
    instance.loadingMoreSearchResults = false;

    instance.onScrollDown();

    expect(store.dispatch).toBeCalledTimes(0);
  });

});

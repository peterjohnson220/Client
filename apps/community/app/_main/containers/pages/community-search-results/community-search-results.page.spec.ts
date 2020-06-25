import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';

import { CommunitySearchResultsPageComponent } from './community-search-results.page';
import { CommunitySearchResultsComponent } from '../../community-search-results';
import { CommunitySearchDurationEnum, CommunitySearchSortByEnum } from 'libs/models/community/community-constants.model';

import * as fromRootState from 'libs/state/state';
import * as fromCommunitySearchActions from '../../../actions/community-search.actions';

describe('CommunitySearchResultsPageComponent', () => {
  let fixture: ComponentFixture<CommunitySearchResultsPageComponent>;
  let instance: CommunitySearchResultsPageComponent;
  let router: Router;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      providers: [
        {
        provide: Router,
        useValue: { navigate: jest.fn() },
      },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: {queryParams: {query: 'test query'}}},
        },
      ],
      declarations: [ CommunitySearchResultsPageComponent, CommunitySearchResultsComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunitySearchResultsPageComponent);
    router = TestBed.inject(Router);
    instance = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should dispatch SearchingCommunity when calling dateSelectionChange', () => {
    instance.searchQuery = 'searchQuery';
    const searchDurationOption = { text: 'All Time', value: CommunitySearchDurationEnum.AllTime};

    const expectedAction = new fromCommunitySearchActions.SearchingCommunity({
      searchTerm: instance.searchQuery,
      searchSort: instance.sortOption,
      searchDuration: searchDurationOption.value
    });

    instance.dateSelectionChange(searchDurationOption);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch SearchingCommunity when calling sortBySelectionChange', () => {
    instance.searchQuery = 'searchQuery';
    const searchSortOption = { text: 'Relevance', value: CommunitySearchSortByEnum.Relevance};

    const expectedAction = new fromCommunitySearchActions.SearchingCommunity({
      searchTerm: instance.searchQuery,
      searchSort: searchSortOption.value,
      searchDuration: instance.durationOption
    });

    instance.sortBySelectionChange(searchSortOption);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

});

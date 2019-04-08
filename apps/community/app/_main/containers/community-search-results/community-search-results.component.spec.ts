import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';

import * as fromCommunitySearchActions from '../../actions/community-search.actions';

import { CommunitySearchResultsComponent } from './community-search-results.component';
import * as fromRootState from 'libs/state/state';

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

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunitySearchResultsComponent);
    instance = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should dispatch SearchingCommunity when calling executeSearch', () => {
    const searchQuery = 'searchQuery';

    const expectedAction = new fromCommunitySearchActions.SearchingCommunity(searchQuery);

    instance.executeSearch(searchQuery);
    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});

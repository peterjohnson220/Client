import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromInfiniteScrollActions from '../../actions/infinite-scroll.actions';
import * as fromInfiniteScrollReducer from '../../reducers';
import { InfiniteScrollComponent } from './infinite-scroll.component';
import { ScrollIdConstants } from '../../models';

describe('Libs - Infinite Scroll - ', () => {
  let fixture: ComponentFixture<InfiniteScrollComponent>;
  let instance: InfiniteScrollComponent;
  let store: Store<fromInfiniteScrollReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_infiniteScrolls: combineReducers(fromInfiniteScrollReducer.reducers)
        })
      ],
      declarations: [
        InfiniteScrollComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(InfiniteScrollComponent);
    instance = fixture.componentInstance;
    instance.scrollId = ScrollIdConstants.SEARCH_SINGLED_FILTER;

    store.dispatch(new fromInfiniteScrollActions.Load({scrollId: instance.scrollId}));
  });

  it('should show a message, when loading more results', () => {
    store.dispatch(new fromInfiniteScrollActions.LoadSuccess({scrollId: instance.scrollId, lastReturnedCount: 30 }));
    store.dispatch(new fromInfiniteScrollActions.LoadMore({scrollId: instance.scrollId}));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadMore action onScroll when not already loading more results and it has results on the server', () => {
    store.dispatch(new fromInfiniteScrollActions.LoadSuccess({scrollId: instance.scrollId, lastReturnedCount: 100 }));
    const expectedAction = new fromInfiniteScrollActions.LoadMore({scrollId: instance.scrollId});
    spyOn(store, 'dispatch');
    instance.numberOfCurrentResults = 15;

    fixture.detectChanges();
    instance.onScroll();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch a LoadMore action onScroll when already loading more results', () => {
    store.dispatch(new fromInfiniteScrollActions.LoadSuccess({scrollId: instance.scrollId, lastReturnedCount: 100 }));
    const loadMoreAction = new fromInfiniteScrollActions.LoadMore({scrollId: instance.scrollId});

    store.dispatch(loadMoreAction);
    spyOn(store, 'dispatch');

    fixture.detectChanges();
    instance.onScroll();

    expect(store.dispatch).not.toHaveBeenCalledWith(loadMoreAction);
  });

  it('should NOT dispatch a LoadMore action onScroll when there is no more results on the server', () => {
    const loadMoreAction = new fromInfiniteScrollActions.LoadMore({scrollId: instance.scrollId});
    store.dispatch(new fromInfiniteScrollActions.LoadSuccess({scrollId: instance.scrollId, lastReturnedCount: 0 }));

    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.onScroll();

    expect(store.dispatch).not.toHaveBeenCalledWith(loadMoreAction);
  });
});

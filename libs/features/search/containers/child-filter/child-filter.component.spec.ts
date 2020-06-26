import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import * as fromRootState from 'libs/state/state';
import * as fromInfiniteScrollActions from 'libs/features/infinite-scroll/actions/infinite-scroll.actions';

import { ChildFilterComponent } from './child-filter.component';
import * as fromSearchReducer from '../../reducers';

describe('Search Feature Child Filter', () => {
  let instance: ChildFilterComponent;
  let fixture: ComponentFixture<ChildFilterComponent>;
  let store: Store<fromSearchReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_search: combineReducers(fromSearchReducer.reducers)
        })
      ],
      declarations: [ ChildFilterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ChildFilterComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);

  });

  it('should dispatch an infinite scroll Load action upon init', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromInfiniteScrollActions.Load({scrollId: ScrollIdConstants.SEARCH_CHILD_FILTER});

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});

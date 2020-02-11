import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildFilterComponent } from './child-filter.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import * as fromChildFilterActions from '../../actions/child-filter.actions';
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
    store = TestBed.get(Store);

  });

  it('should dispatch a SearchAggregation action upon init', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromChildFilterActions.SearchAggregation();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});

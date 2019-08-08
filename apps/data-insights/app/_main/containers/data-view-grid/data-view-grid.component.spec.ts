import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineReducers, StoreModule, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromDataViewActions from '../../actions/data-view.actions';
import * as fromDataViewGridActions from '../../actions/data-view-grid.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { DataViewGridComponent } from './data-view-grid.component';

describe('Data Insights - Data View Grid', () => {
  let fixture: ComponentFixture<DataViewGridComponent>;
  let instance: DataViewGridComponent;
  let store: Store<fromDataInsightsMainReducer.State>;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers)
        })
      ],
      declarations: [ DataViewGridComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { dataViewId : 1 } } }
        }
      ]
    });

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(DataViewGridComponent);
    instance = fixture.componentInstance;
    route = TestBed.get(ActivatedRoute);
  });

  it('should dispatch GetMoreData when not currently loading more data and having more data on server', () => {
    const getMoreDataAction = new fromDataViewGridActions.GetMoreData();
    const results = [];
    const numberOfResults = 25;
    for (let i = 0; i < numberOfResults; i++) {
      results.push(i);
    }
    store.dispatch(new fromDataViewGridActions.GetMoreDataSuccess(results));
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.handleScrollBottom();

    expect(store.dispatch).toHaveBeenCalledWith(getMoreDataAction);
  });

  it('should NOT dispatch GetMoreData when it currently loading more data', () => {
    const getMoreDataAction = new fromDataViewGridActions.GetMoreData();
    store.dispatch(new fromDataViewGridActions.GetMoreData());
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.handleScrollBottom();

    expect(store.dispatch).not.toHaveBeenCalledWith(getMoreDataAction);
  });

  it('should NOT dispatch GetMoreData when there is no more data on server', () => {
    const getMoreDataAction = new fromDataViewGridActions.GetMoreData();
    const results = [];
    const numberOfResults = 10;
    for (let i = 0; i < numberOfResults; i++) {
      results.push(i);
    }
    store.dispatch(new fromDataViewGridActions.GetMoreDataSuccess(results));
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.handleScrollBottom();

    expect(store.dispatch).not.toHaveBeenCalledWith(getMoreDataAction);
  });
});

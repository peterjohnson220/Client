import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';

import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromExchangeJobsReducer from '../../reducers';
import { ExchangeJobsComponent } from './exchange-jobs.component';

describe('ExchangeJobsComponent', () => {
  let component: ExchangeJobsComponent;
  let fixture: ComponentFixture<ExchangeJobsComponent>;
  let store: Store<fromExchangeJobsReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_job_association: combineReducers(fromExchangeJobsReducer.reducers)
        }),
      ],
      declarations: [ ExchangeJobsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show total exchange jobs', () => {
    component.totalPeerExchangeJobs$ = of(123);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should fire a LoadExchangeJobs action on init', () => {
    const loadExchangeJobsAction = new fromExchangeJobsActions.LoadExchangeJobs();
    expect(store.dispatch).toHaveBeenCalledWith(loadExchangeJobsAction);
  });

  it('should fire the right actions when the grid state is changed', () => {
    const dataStateChangeEvent = {} as DataStateChangeEvent;
    component.handleDataStateChange(dataStateChangeEvent);

    const updateGridAction = new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalPeerExchangeJobs, dataStateChangeEvent);
    const loadExchangeJobsAction = new fromExchangeJobsActions.LoadExchangeJobs();

    expect(store.dispatch).toHaveBeenCalledWith(updateGridAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadExchangeJobsAction);
  });
});

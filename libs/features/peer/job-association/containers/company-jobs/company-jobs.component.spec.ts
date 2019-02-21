import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';

import * as fromCompanyJobsActions from '../../actions/company-jobs.actions';
import * as fromCompanyJobsReducer from '../../reducers';
import { CompanyJobsComponent } from './company-jobs.component';

describe('CompanyJobsComponent', () => {
  let component: CompanyJobsComponent;
  let fixture: ComponentFixture<CompanyJobsComponent>;
  let store: Store<fromCompanyJobsReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_job_association: combineReducers(fromCompanyJobsReducer.reducers)
        }),
      ],
      declarations: [ CompanyJobsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show total company jobs', () => {
    component.totalCompanyJobsGridItems$ = of(123);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should fire a LoadCompanyJobs action on init', () => {
    const loadCompanyJobsAction = new fromCompanyJobsActions.LoadCompanyJobs();
    expect(store.dispatch).toHaveBeenCalledWith(loadCompanyJobsAction);
  });

  it('should fire the right actions when the grid state is changed', () => {
    const dataStateChangeEvent = {} as DataStateChangeEvent;
    component.handleDataStateChange(dataStateChangeEvent);

    const updateGridAction = new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalCompanyJobs, dataStateChangeEvent);
    const loadCompanyJobsAction = new fromCompanyJobsActions.LoadCompanyJobs();

    expect(store.dispatch).toHaveBeenCalledWith(updateGridAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadCompanyJobsAction);
  });
});

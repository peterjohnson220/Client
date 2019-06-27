import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';

import { CompanyJobsGridComponent } from './company-jobs-grid.component';
import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as manageReducers from '../../reducers/';

describe('CompanyJobsGridComponent', () => {
  let component: CompanyJobsGridComponent;
  let fixture: ComponentFixture<CompanyJobsGridComponent>;
  let store: Store<manageReducers.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_manage: combineReducers(manageReducers.reducers)
        }),
        NgbTooltipModule
      ],
      declarations: [ CompanyJobsGridComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyJobsGridComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a kendo grid with columns', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should fire the right actions when the grid state is changed', () => {
    // Arrange
    const dataStateChangeEvent = {} as DataStateChangeEvent;
    const updateGridAction = new fromGridActions.UpdateGrid(GridTypeEnum.PeerManageCompanyJobs, dataStateChangeEvent);
    const loadCompanyJobsAction = new companyJobsActions.LoadCompanyJobs();

    // Act
    component.handleDataStateChange(dataStateChangeEvent);

    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(updateGridAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadCompanyJobsAction);
  });

  it('should fire a page change action when the filters change', () => {
    // Arrange
    component.gridFilter = { filters: [], logic: 'and' };
    const dataStateChangeEvent = { filter: { filters: [{ value: 'something different' }], logic: 'and' } } as DataStateChangeEvent;
    const updateGridAction = new fromGridActions.UpdateGrid(GridTypeEnum.PeerManageCompanyJobs, dataStateChangeEvent);
    const loadCompanyJobsAction = new companyJobsActions.LoadCompanyJobs();
    const pageChangeAction = new fromGridActions.PageChange(GridTypeEnum.PeerManageCompanyJobs, { skip: 0 } as PageChangeEvent);

    // Act
    component.handleDataStateChange(dataStateChangeEvent);

    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(updateGridAction);
    expect(store.dispatch).toHaveBeenCalledWith(pageChangeAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadCompanyJobsAction);
  });

  it('should fire the expected actions when reloaded', () => {
    // Arrange
    const loadCompanyJobsAction = new companyJobsActions.LoadCompanyJobs();
    const pageChangeAction = new fromGridActions.PageChange(GridTypeEnum.PeerManageCompanyJobs, { skip: 0 } as PageChangeEvent);

    // Act
    component.reloadGrid();

    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(pageChangeAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadCompanyJobsAction);
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';
import { generateMockCompanyJob } from 'libs/features/peer/job-association/models/company-job.model';

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
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: { queryParamMap: { get: (key) => '' } }
          }
        }
      ]
    })
    .compileComponents();

    store = TestBed.inject(Store);
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

  it ('should not do anything when handleCellClick is called for the already selected company job', () => {
    // Arrange
    component.selectedCompanyJob = { ...generateMockCompanyJob(), CompanyJobId: 123 };

    // Act
    component.handleCellClick({ dataItem: { CompanyJobId: 123 }, rowIndex: 456 });

    // Assert
    const unexpectedScrollAction = new companyJobsActions.UpdatePageRowIndexToScrollTo(456);
    const unexpectedLoadAction = new companyJobsActions.LoadMappedExchangeJobs(123);
    const unexpectedSearchAction = new companyJobsActions.SearchExchangeJobs();

    expect(store.dispatch).not.toHaveBeenCalledWith(unexpectedScrollAction);
    expect(store.dispatch).not.toHaveBeenCalledWith(unexpectedLoadAction);
    expect(store.dispatch).not.toHaveBeenCalledWith(unexpectedSearchAction);
  });

  it ('should scroll and load mapped exchange jobs when an associated company job is selected', () => {
    // Arrange
    component.companyJobsGridState = { skip: 0 };

    // Act
    component.handleCellClick({ dataItem: { CompanyJobId: 789, IsAssociated: true }, rowIndex: 20 });

    // Assert
    const expectedScrollAction = new companyJobsActions.UpdatePageRowIndexToScrollTo(20);
    const expectedLoadAction = new companyJobsActions.LoadMappedExchangeJobs(789);
    const unexpectedSearchAction = new companyJobsActions.SearchExchangeJobs();

    expect(store.dispatch).toHaveBeenCalledWith(expectedScrollAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedLoadAction);
    expect(store.dispatch).not.toHaveBeenCalledWith(unexpectedSearchAction);
  });

  it ('should scroll and search exchange jobs when a new unassociated company job is selected', () => {
    // Arrange
    component.companyJobsGridState = { skip: 0 };

    // Act
    component.handleCellClick({ dataItem: { CompanyJobId: 789, IsAssociated: false }, rowIndex: 20 });

    // Assert
    const expectedScrollAction = new companyJobsActions.UpdatePageRowIndexToScrollTo(20);
    const expectedLoadAction = new companyJobsActions.LoadMappedExchangeJobs(789);
    const unexpectedSearchAction = new companyJobsActions.SearchExchangeJobs();

    expect(store.dispatch).toHaveBeenCalledWith(expectedScrollAction);
    expect(store.dispatch).not.toHaveBeenCalledWith(expectedLoadAction);
    expect(store.dispatch).toHaveBeenCalledWith(unexpectedSearchAction);
  });
});

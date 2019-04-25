import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@progress/kendo-angular-grid';

import { HighlightTextPipe, JobDescriptionParserPipe } from 'libs/core/pipes';
import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';

import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromExchangeJobsReducer from '../../reducers';
import { ExchangeJobsComponent } from './exchange-jobs.component';
import { generateMockCompanyJob } from '../../models';

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
        NgbTooltipModule
      ],
      declarations: [ ExchangeJobsComponent, HighlightTextPipe, JobDescriptionParserPipe ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeJobsComponent);
    component = fixture.componentInstance;
    component.jobTitleSearchComponent = {} as any;
    component.jobTitleSearchComponent.writeValue = () => {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show total exchange jobs', () => {
    component.totalPeerExchangeJobs$ = of(123);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should fire the right actions when the grid state is changed', () => {
    const dataStateChangeEvent = {} as DataStateChangeEvent;
    component.handleDataStateChange(dataStateChangeEvent);

    const updateGridAction = new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalPeerExchangeJobs, dataStateChangeEvent);
    const loadExchangeJobsAction = new fromExchangeJobsActions.LoadExchangeJobs();

    expect(store.dispatch).toHaveBeenCalledWith(updateGridAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadExchangeJobsAction);
  });

  it('should fire the UpdateSearchTerm action when the search term is changed', () => {
    const searchTerm = 'abc';
    component.handleJobTitleFilterChanged(searchTerm);

    const updateSearchTermAction = new fromExchangeJobsActions.UpdateSearchTerm(searchTerm);

    expect(store.dispatch).toHaveBeenCalledWith(updateSearchTermAction);
  });

  it('should not fire the LoadExchangeJobs action when the search term is one character', () => {
    const searchTerm = 'a';
    component.handleJobTitleFilterChanged(searchTerm);

    const loadExchangeJobsAction = new fromExchangeJobsActions.LoadExchangeJobs();

    expect(store.dispatch).not.toHaveBeenCalledWith(loadExchangeJobsAction);
  });

  it('should fire the correct actions when the search term is more than one character', () => {
    const searchTerm = 'ab';
    component.handleJobTitleFilterChanged(searchTerm);

    const updateSearchTermAction = new fromExchangeJobsActions.UpdateSearchTerm(searchTerm);
    const loadExchangeJobsAction = new fromExchangeJobsActions.LoadExchangeJobs();

    expect(store.dispatch).toHaveBeenCalledWith(updateSearchTermAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadExchangeJobsAction);
  });

  it('should fire the expected action when handleAssociateClick is clicked', () => {
    const dataItem = { ExchangeId: 123, ExchangeJobId: 456, CompanyJobMappings: [generateMockCompanyJob()] };

    const addAssociationAction = new fromExchangeJobsActions.AddAssociation({
      ExchangeId: dataItem.ExchangeId,
      ExchangeJobId: dataItem.ExchangeJobId,
      CompanyJobs: [generateMockCompanyJob()]
    });

    component.isAssociable = () => true;
    component.grid = {} as GridComponent;
    component.grid.expandRow = () => ({});
    component.grid.collapseRow = () => ({});
    component.selectedCompanyJobs = [generateMockCompanyJob()];
    component.handleAssociateClick(dataItem, 44);

    expect(store.dispatch).toHaveBeenCalledWith(addAssociationAction);
  });

  it('should not fire an action when handleAssociateClick is clicked and isAssociable returns false', () => {
    const dataItem = { ExchangeId: 123, ExchangeJobId: 456, CompanyJobMappings: [generateMockCompanyJob()] };

    const addAssociationAction = new fromExchangeJobsActions.AddAssociation({
      ExchangeId: dataItem.ExchangeId,
      ExchangeJobId: dataItem.ExchangeJobId,
      CompanyJobs: [generateMockCompanyJob()]
    });

    component.isAssociable = () => false;
    component.handleAssociateClick(dataItem, 44);

    expect(store.dispatch).not.toHaveBeenCalledWith(addAssociationAction);
  });

  it('should create the correct associate button tooltip msg when no jobs are selected', () => {
    component.selectedCompanyJobs = [];

    const tooltipText = component.createAssociateButtonTooltipText(123, 456);
    expect(tooltipText).toBe('First select the company job you want to associate');
  });

  it('should create the correct associate button tooltip msg when the job is associable', () => {
    component.maxAssociableThreshold = 10;
    component.selectedCompanyJobs = [generateMockCompanyJob()];
    component.isAssociable = () => true;
    component.getAssociationCount = () => 1;

    const tooltipText = component.createAssociateButtonTooltipText(123, 456);
    expect(tooltipText).toBe('Click to associate');
  });

  it('should create the correct associate button tooltip msg when there are > 10 associations', () => {
    component.maxAssociableThreshold = 10;
    component.selectedCompanyJobs = [generateMockCompanyJob()];
    component.isAssociable = () => false;
    component.getAssociationCount = () => component.maxAssociableThreshold + 1;

    const tooltipText = component.createAssociateButtonTooltipText(123, 456);
    expect(tooltipText).toBe('Exchange jobs should not have more than 10 associations per exchange');
  });

  it('should create the correct associate button tooltip msg when the job is already associated to an exchange', () => {
    component.maxAssociableThreshold = 10;
    component.selectedCompanyJobs = [generateMockCompanyJob()];
    component.isAssociable = () => false;
    component.getAssociationCount = () => 1;

    const tooltipText = component.createAssociateButtonTooltipText(123, 456);
    expect(tooltipText).toBe('A single company job can be associated to only 1 job per exchange');
  });
});

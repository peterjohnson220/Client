import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as cloneDeep from 'lodash.clonedeep';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { of, Subject } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { generateMockListAreaColumns } from 'libs/models/common/list-area';
import {
  generateMockCompositeFilter,
  generateMockFilter,
  generateMockFilters,
  generateMockJdmListFilter
} from 'libs/models/user-profile';
import { PermissionService, RouteTrackingService } from 'libs/core/services';
import { SettingsService } from 'libs/state/app-context/services';

import { JobDescriptionListPageComponent } from './job-description-list.page';
import * as fromBulkExportPopoverActions from '../../../actions/bulk-export-popover.actions';
import * as fromJobDescriptionListActions from '../../../actions/job-description-list.actions';
import * as fromJobDescriptionGridActions from '../../../actions/job-description-grid.actions';
import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromJobInformationFieldsActions from '../../../actions/job-information-fields.actions';
import * as fromUserFilterActions from '../../../actions/user-filter.actions';
import { CompanyJobViewListItem, generateMockCompanyJobViewListItem } from '../../../models';
import { AssignJobsToTemplateModalComponent, JobDescriptionHistoryModalComponent, SaveFilterModalComponent,
  WorkflowCancelModalComponent } from '../../../components';

import { PayfactorsApiModelMapper } from '../../../../shared/helpers';
import {
  JobDescriptionAppliesToModalComponent
} from '../../../../shared/components/modals/job-description-applies-to/job-description-applies-to-modal.component';
import {
  DeleteJobDescriptionModalComponent
} from '../../../../shared/components/modals/delete-job-description-modal/delete-job-description-modal.component';

describe('Job Description Management - Job Description - Job Description List Page', () => {
  let instance: JobDescriptionListPageComponent;
  let fixture: ComponentFixture<JobDescriptionListPageComponent>;
  let store: Store<fromJobDescriptionReducers.State>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      providers: [SettingsService,
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: { queryParamMap: { get: (key) => '' } }
          }
        },
        {
          provide: RouteTrackingService,
          useValue: {
            previousRoute: ''
          }
        },
        {
          provide: FormBuilder,
          useValue: { group: jest.fn() }
        },
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        },
        {
          provide: PermissionService,
          useValue: { CheckPermission: jest.fn(() => true) }
        }
      ],
      declarations: [
        JobDescriptionListPageComponent, AssignJobsToTemplateModalComponent, JobDescriptionHistoryModalComponent,
        JobDescriptionAppliesToModalComponent, SaveFilterModalComponent, WorkflowCancelModalComponent, DeleteJobDescriptionModalComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobDescriptionListPageComponent);
    instance = fixture.componentInstance;

    instance.assignJobToTemplateModalComponent = TestBed.createComponent(AssignJobsToTemplateModalComponent).componentInstance;
    instance.jobDescriptionHistoryModalComponent = TestBed.createComponent(JobDescriptionHistoryModalComponent).componentInstance;
    instance.jobDescriptionAppliesToModalComponent = TestBed.createComponent(JobDescriptionAppliesToModalComponent).componentInstance;
    instance.saveFilterModalComponent = TestBed.createComponent(SaveFilterModalComponent).componentInstance;
    instance.deleteJobDescriptionModalComponent = TestBed.createComponent(DeleteJobDescriptionModalComponent).componentInstance;

    instance.saveFilterModalComponent.filterForm = new FormGroup({});
    instance.filterThrottle = new Subject();
    instance.savedGridState$ = of({ skip: 0, take: 20 });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should dispatch a CreateJobDescription action, when calling appliesToFormCompleted with templateId of -1', () => {
    spyOn(store, 'dispatch');

    const mockedSelected = {
      companyJobId: 1,
      templateId: -1,
      jobDescriptionAppliesTo: null
    };

    const companyJobViewListItem = new CompanyJobViewListItem();
    companyJobViewListItem.CompanyJobId = 1;

    const expectedAction = new fromJobDescriptionListActions.CreateJobDescription({
      companyJobViewListItem,
      appliesTo: mockedSelected.jobDescriptionAppliesTo
    });

    instance.appliesToFormCompleted(mockedSelected);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should dispatch a SaveCompanyJobsJobDescriptionTemplateId action, when calling appliesToFormCompleted with templateId not -1', () => {
    spyOn(store, 'dispatch');

    const mockedSelected = {
      companyJobId: 1,
      templateId: 1,
      jobDescriptionAppliesTo: null
    };

    const mockedNewJobDescription = new CompanyJobViewListItem();
    mockedNewJobDescription.CompanyJobId = mockedSelected.companyJobId;

    const companyJobIdsToAssign = [mockedNewJobDescription.CompanyJobId];
    const passThroughParameters = {
      newJobDescription: mockedNewJobDescription,
      jobDescriptionAppliesTo: mockedSelected.jobDescriptionAppliesTo,
      templateId: 1
    };

    const expectedAction = new fromJobDescriptionListActions.SaveCompanyJobsJobDescriptionTemplateId({
      companyJobIdsToAssign, passThroughParameters
    });

    instance.appliesToFormCompleted(mockedSelected);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should return a QueryListStateRequest object containing the latest listFilter and gridState, when getQueryListStateRequest is called',
    () => {
    const expectedResult = {
      Query: undefined,
      ListState: JSON.stringify({ skip: 0, take: 20 })
    };

    const listStateRequest = instance.getQueryListStateRequest();

    expect(listStateRequest).toEqual(expectedResult);
  });

  it('should dispatch an OpenBulkExportPopover action, when calling handleBulkExportPopoverOpened', () => {
    spyOn(store, 'dispatch');

    instance.handleBulkExportPopoverOpened();

    const expectedRequest = {
      Query: undefined,
      ListState: JSON.stringify({ skip: 0, take: 20 })
    };

    const expectedAction = new fromBulkExportPopoverActions.OpenBulkExportPopover(expectedRequest);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should reset the gridState & dispatch a LoadJobDescriptionGrid action, when calling handleClearAllFilters', () => {
    spyOn(store, 'dispatch');

    instance.gridState.filter = generateMockCompositeFilter();
    instance.gridState.skip = 1;

    instance.handleClearAllFilters();

    expect(instance.gridState.filter.filters).toEqual([]);
    expect(instance.gridState.skip).toEqual(0);

    const expectedRequest = {
      Query: undefined,
      ListState: JSON.stringify(instance.gridState)
    };

    const expectedAction = new fromJobDescriptionGridActions.LoadJobDescriptionGrid(expectedRequest);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should remove filter from the gridState, when calling handleClearFilter', () => {
    spyOn(instance.filterThrottle, 'next');

    const mockedCurrentFilter = generateMockCompositeFilter();

    instance.gridState.filter = cloneDeep(mockedCurrentFilter);

    const filterToRemove = mockedCurrentFilter.filters.pop() as FilterDescriptor;

    instance.handleClearFilter(filterToRemove);

    expect(instance.filterThrottle.next).toHaveBeenLastCalledWith(mockedCurrentFilter.filters);
  });

  it('should dispatch a CreateJobDescription action, when calling handleCreateCompanyJobComplete with addAndAssign equal to true', () => {
    spyOn(store, 'dispatch');

    const mockedComplete = {
      addAndAssign: true,
      companyJobId: 1
    };

    const companyJobViewListItem = new CompanyJobViewListItem();
    companyJobViewListItem.CompanyJobId = mockedComplete.companyJobId;
    companyJobViewListItem.JobDescriptionStatus = 'Not Started';

    const expectedAction = new fromJobDescriptionListActions.CreateJobDescription({
      companyJobViewListItem
    });

    instance.handleCreateCompanyJobComplete(mockedComplete);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should dispatch a LoadJobDescriptionGrid action, when calling handleCreateCompanyJobComplete with addAndAssign equal to false',
    () => {
    spyOn(store, 'dispatch');

    const mockedComplete = {
      addAndAssign: false,
      companyJobId: 1
    };

    instance.handleCreateCompanyJobComplete(mockedComplete);

    const expectedAction = new fromJobDescriptionGridActions.LoadJobDescriptionGrid(instance.getQueryListStateRequest());

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should pass along filters to filterThrottle, when calling handleFilterChanged', () => {
    spyOn(instance.filterThrottle, 'next');

    const mockedCurrentFilters = generateMockFilters();

    instance.handleFilterChanged(mockedCurrentFilters);

    expect(instance.filterThrottle.next).toHaveBeenLastCalledWith(mockedCurrentFilters);
  });

  it('should set the gridState skip value to that of the skip value in event, when calling handlePageChanged', () => {
    spyOn(store, 'dispatch');

    const mockedEvent = { skip: 10, take: 1 };

    instance.handlePageChanged(mockedEvent);

    expect(instance.gridState.skip).toBe(10);

    const expectedAction = new fromJobDescriptionGridActions.LoadJobDescriptionGrid(instance.getQueryListStateRequest());

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should set the sort parameter to the gridState sort array, when calling handleSortChanged', () => {
    spyOn(store, 'dispatch');

    const mockedSort = [{ field: 'test1' }, { field: 'test2' }];

    instance.handleSortChanged(mockedSort);

    expect(instance.gridState.sort).toBe(mockedSort);

    const expectedAction = new fromJobDescriptionGridActions.LoadJobDescriptionGrid(instance.getQueryListStateRequest());

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should dispatch a LoadUserFilterList action, when calling handleSaveFilterModalOpened', () => {
    spyOn(store, 'dispatch');

    instance.handleSaveFilterModalOpened();

    const expectedAction = new fromUserFilterActions.LoadUserFilterList();

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should dispatch a SaveCompanyJobsJobDescriptionTemplateId action, when calling handleTemplateAssignedToJob', () => {
    spyOn(store, 'dispatch');

    const mockedAssignTemplateToJobObj = { templateId: 1, selectedCompanyJob: { CompanyJobId: 1 } };

    instance.handleTemplateAssignedToJob(mockedAssignTemplateToJobObj);

    const companyJobIdsToAssign = [1];
    const passThroughParameters = cloneDeep(mockedAssignTemplateToJobObj);

    const expectedAction = new fromJobDescriptionListActions.SaveCompanyJobsJobDescriptionTemplateId({
      companyJobIdsToAssign,
      passThroughParameters
    });

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should dispatch a DeleteUserFilter action, when calling handleUserFilterDeleteConfirmed', () => {
    spyOn(store, 'dispatch');

    const mockedId = '1';

    instance.handleUserFilterDeleteConfirmed(mockedId);

    const expectedRequest = '1';
    const expectedAction = new fromUserFilterActions.DeleteUserFilter(expectedRequest);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should dispatch a LoadUserFilterList action, when calling handleUserFilterListPopoverOpened', () => {
    spyOn(store, 'dispatch');

    instance.handleUserFilterListPopoverOpened();

    const expectedAction = new fromUserFilterActions.LoadUserFilterList();

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should re-assign filters, when calling handleUserFilterSelected', () => {
    spyOn(instance.filterThrottle, 'next');

    instance.displayedListAreaColumnNames = ['Test Field 1'];
    instance.customListAreaColumns = generateMockListAreaColumns();

    const mockedUserFilter = generateMockJdmListFilter();

    instance.handleUserFilterSelected(mockedUserFilter);

    const expectedFilters = [generateMockFilter(1)];

    expect(instance.filterThrottle.next).toHaveBeenLastCalledWith(expectedFilters);
  });

  it('should dispatch LoadControlLabels & LoadJobInformationFieldsForBulkExport actions for handleViewSelectionChangedOnBulkExport',
    () => {
    spyOn(store, 'dispatch');

    const mockViewName = 'Test View Name';

    instance.handleViewSelectionChangedOnBulkExport(mockViewName);

    const expectedFirstAction = new fromBulkExportPopoverActions.LoadControlLabels(mockViewName);
    const expectedSecondAction = new fromJobInformationFieldsActions.LoadJobInformationFieldsForBulkExport(mockViewName);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedFirstAction);
    expect(store.dispatch).toHaveBeenNthCalledWith(2, expectedSecondAction);
  });

  it('should open assignJobToTemplateModalComponent, when calling openAssignJobModal', () => {
    spyOn(instance.assignJobToTemplateModalComponent, 'open');

    const mockSelectedCompanyJob = generateMockCompanyJobViewListItem();

    instance.openAssignJobModal(mockSelectedCompanyJob);

    expect(instance.selectedCompanyJobForModal).toEqual(cloneDeep(mockSelectedCompanyJob));
    expect(instance.assignJobToTemplateModalComponent.open).toHaveBeenCalled();
  });

  it('should open deleteJobDescriptionModalComponent, when calling openDeleteJobDescModal', () => {
    spyOn(instance.deleteJobDescriptionModalComponent, 'open');

    const jobDescrtiptionId = 123;

    instance.openDeleteJobDescModal(jobDescrtiptionId);
    expect(instance.deleteJobDescriptionModalComponent.open).toHaveBeenCalled();
  });

  it('should open jobDescriptionHistoryModalComponent, when calling openJobDescriptionHistoryModal', () => {
    spyOn(instance.jobDescriptionHistoryModalComponent, 'open');

    const mockJobDescriptionIdObj = { jobDescriptionId: 1, jobTitle: 'Test Job Title' };

    instance.openJobDescriptionHistoryModal(mockJobDescriptionIdObj);

    expect(instance.jobDescriptionHistoryModalComponent.open).toHaveBeenLastCalledWith(1, 'Test Job Title');
  });

  it('should open jobDescriptionAppliesToModalComponent, when calling openNewJobDescModal', () => {
    spyOn(instance.jobDescriptionAppliesToModalComponent, 'open');

    const mockSelectedCompanyJob = generateMockCompanyJobViewListItem();

    instance.openNewJobDescModal(mockSelectedCompanyJob);

    expect(instance.selectedCompanyJobForModal).toEqual(cloneDeep(mockSelectedCompanyJob));
  });

  it('should open saveFilterModalComponent, when calling saveFilterClicked', () => {
    spyOn(instance.saveFilterModalComponent, 'open');

    instance.saveFilterClicked();

    expect(instance.saveFilterModalComponent.open).toHaveBeenCalled();
  });

  it('should dispatch an AddUserFilter action, when calling saveFilterHandler', () => {
    spyOn(store, 'dispatch');

    const mockedFilterName = 'Test Filter Name';

    instance.saveFilterHandler(mockedFilterName);

    const expectedRequest = {
      Id: null,
      Name: mockedFilterName,
      CompositeFilter: PayfactorsApiModelMapper.mapCompositeFilterToCompositeUppercase(instance.gridState.filter)
    };
    const expectedAction = new fromUserFilterActions.AddUserFilter(expectedRequest);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should dispatch UpdateSearchTerm & LoadJobDescriptionGrid actions, when calling updateSearchFilter', () => {
      spyOn(store, 'dispatch');

      const mockNewSearchTerm = 'Test Search Term';

      instance.updateSearchFilter(mockNewSearchTerm);

      expect(instance.listFilter).toBe(mockNewSearchTerm);
      expect(instance.gridState.skip).toBe(0);

      const expectedFirstAction = new fromJobDescriptionGridActions.UpdateSearchTerm(mockNewSearchTerm);
      const expectedSecondAction = new fromJobDescriptionGridActions.LoadJobDescriptionGrid(instance.getQueryListStateRequest());

      expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedFirstAction);
      expect(store.dispatch).toHaveBeenNthCalledWith(2, expectedSecondAction);
    });
});

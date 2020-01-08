import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';
import { debounceTime, takeWhile, filter } from 'rxjs/operators';

import * as fromUserContextReducer from 'libs/state/app-context/reducers/user-context.reducer';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import { JdmListFilter } from 'libs/models/user-profile';
import { ListAreaColumn } from 'libs/models/common';
import { UserContext } from 'libs/models/security';
import { CompanySettingsEnum } from 'libs/models';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { SettingsService } from 'libs/state/app-context/services';
import { environment } from 'environments/environment';

import * as fromBulkExportPopoverActions from '../../../actions/bulk-export-popover.actions';
import * as fromJobDescriptionListActions from '../../../actions/job-description-list.actions';
import * as fromJobDescriptionGridActions from '../../../actions/job-description-grid.actions';
import * as fromJobInformationFieldsActions from '../../../actions/job-information-fields.actions';
import * as fromUserFilterActions from '../../../actions/user-filter.actions';
import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromRootState from 'libs/state/state';

import { AssignJobsToTemplateModalComponent, JobDescriptionHistoryModalComponent } from '../../../components';

import { CompanyJobViewListItem } from '../../../models';
import { AvailableJobInformationField, ControlLabel, JobDescriptionAppliesTo } from '../../../../shared/models';
import {
  JobDescriptionAppliesToModalComponent
} from '../../../../shared/components/modals/job-description-applies-to';
import { JobDescriptionViewConstants } from '../../../../shared/constants/job-description-view-constants';
import { SaveFilterModalComponent } from '../../../components/modals/save-filter';
import { PayfactorsApiModelMapper } from '../../../../shared/helpers';
import { AddJobModalComponent } from '../../../components/modals/add-job';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pf-job-description-list-page',
  templateUrl: './job-description-list.page.html',
  styleUrls: ['./job-description-list.page.scss']
})
export class JobDescriptionListPageComponent implements OnInit, OnDestroy {
  @ViewChild(AssignJobsToTemplateModalComponent,
    { static: true }) public assignJobToTemplateModalComponent: AssignJobsToTemplateModalComponent;
  @ViewChild(JobDescriptionHistoryModalComponent,
    { static: true }) jobDescriptionHistoryModalComponent: JobDescriptionHistoryModalComponent;
  @ViewChild(JobDescriptionAppliesToModalComponent,
    { static: true }) public jobDescriptionAppliesToModalComponent: JobDescriptionAppliesToModalComponent;
  @ViewChild(AddJobModalComponent, { static: true }) public addJobModalComponent: AddJobModalComponent;
  @ViewChild(SaveFilterModalComponent, { static: true }) public saveFilterModalComponent: SaveFilterModalComponent;

  public identity$: Observable<UserContext>;
  public gridLoading$: Observable<boolean>;
  public gridDataResult$: Observable<GridDataResult>;
  public userFilterError$: Observable<boolean>;
  public listAreaColumns$: Observable<ListAreaColumn[]>;
  public selectedCompanyJobForModal: CompanyJobViewListItem;
  public userFilterList$: Observable<JdmListFilter[]>;
  public userFilterListLoading$: Observable<boolean>;
  public userFilterDeleting$: Observable<boolean>;

  savedGridState$: Observable<State>;
  private listAreaColumnsToUpdate$: Observable<ListAreaColumn[]>;
  private bulkExportControlLabels$: Observable<ControlLabel[]>;
  private bulkExportControlLabelsLoading$: Observable<boolean>;
  private bulkExportNoPublishedJobDescriptions$: Observable<boolean>;
  private savedSearchTerm$: Observable<string>;
  private userFilterListAdding$: Observable<boolean>;
  private userFilterErrorMessage$: Observable<string>;
  private jobDescriptionListViewsLoading$: Observable<boolean>;
  private jobDescriptionListViews$: Observable<string[]>;
  private jobInformationFields$: Observable<AvailableJobInformationField[]>;
  private jobInformationFieldsLoading$: Observable<boolean>;
  private savingListAreaColumnsSuccess$: Observable<boolean>;
  private enablePublicViewsInClient$: Observable<boolean>;

  public savedSearchTerm: string;
  public gridState: State;
  public nonStaticListAreaColumns: ListAreaColumn[];
  public customListAreaColumns: ListAreaColumn[] = [];
  public showFilterSidebar: any;
  public filterThrottle: Subject<any>;
  public displayedListAreaColumnNames: string[];
  public tokenId: string;
  public isPublic: boolean;
  public publicCompanyId: number;
  public listFilter: string;
  public permissions = Permissions;

  private listAreaColumnsSubscription: Subscription;
  private routerParmsSubscription: Subscription;
  private savingListAreaColumnsSuccessSubscription: Subscription;
  gridStateSubscription: Subscription;

  constructor(
    private userContextStore: Store<fromUserContextReducer.State>,
    private store: Store<fromJobDescriptionReducers.State>,
    private router: Router,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private settingsService: SettingsService
  ) {
    this.identity$ = this.store.select(fromRootState.getUserContext);
    this.gridLoading$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionGridLoading);
    this.gridDataResult$ = this.store.select(fromJobDescriptionReducers.getGridDataResult);
    this.listAreaColumns$ = this.store.select(fromJobDescriptionReducers.getListAreaColumns);
    this.listAreaColumnsToUpdate$ = this.store.select(fromJobDescriptionReducers.getListAreaColumnsToUpdate);
    this.savedSearchTerm$ = this.store.select(fromJobDescriptionReducers.getSearchTerm);
    this.savedGridState$ = this.store.select(fromJobDescriptionReducers.getGridState);
    this.bulkExportControlLabels$ = this.store.select(fromJobDescriptionReducers.getControlLabels);
    this.bulkExportControlLabelsLoading$ = this.store.select(fromJobDescriptionReducers.getControlLabelsLoading);
    this.bulkExportNoPublishedJobDescriptions$ = this.store.select(
      fromJobDescriptionReducers.getNoPublishedJobDescriptions);
    this.userFilterList$ = this.store.select(fromJobDescriptionReducers.getUserFilterList);
    this.userFilterListLoading$ = this.store.select(fromJobDescriptionReducers.getUserFilterLoading);
    this.userFilterDeleting$ = this.store.select(fromJobDescriptionReducers.getUserFilterDeleting);
    this.userFilterListAdding$ = this.store.select(fromJobDescriptionReducers.getUserFilterAdding);
    this.userFilterError$ = this.store.select(fromJobDescriptionReducers.getUserFilterError);
    this.userFilterErrorMessage$ = this.store.select(fromJobDescriptionReducers.getUserFilterErrorMessage);
    this.jobDescriptionListViews$ = this.store.select(fromJobDescriptionReducers.getViewNames);
    this.jobDescriptionListViewsLoading$ = this.store.select(fromJobDescriptionReducers.getViewNamesLoading);
    this.jobInformationFieldsLoading$ = this.store.select(
      fromJobDescriptionReducers.getJobInformationFieldsForBulkExportLoading);
    this.jobInformationFields$ = this.store.select(
      fromJobDescriptionReducers.getJobInformationFieldsForBulkExport);
    this.savingListAreaColumnsSuccess$ = this.store.select(fromJobDescriptionReducers.getListAreaColumnsSavingSuccess);
    this.enablePublicViewsInClient$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.JDMPublicViewsUseClient);

    this.filterThrottle = new Subject();

    this.customListAreaColumns.push({
      ListAreaColumnId: -1,
      ColumnDatabaseName: 'JobDescription',
      ColumnDisplayName: 'Job Description',
      ColumnDataType: 'text',
      Visible: false,
      Order: 0,
      Default: false,
      Required: false,
      DisableDropdown: true
    });
  }

  addJobClicked() {
    this.addJobModalComponent.open();
  }

  appliesToFormCompleted(selected: any) {
    const newJobDescription = new CompanyJobViewListItem();
    newJobDescription.CompanyJobId = selected.companyJobId;

    if (selected.templateId === -1) {
      this.store.dispatch(new fromJobDescriptionListActions.CreateJobDescription({
        companyJobViewListItem: newJobDescription,
        appliesTo: selected.jobDescriptionAppliesTo
      }));
    } else {
      const passThroughParameters = {
        templateId: selected.templateId,
        newJobDescription: newJobDescription,
        jobDescriptionAppliesTo: selected.jobDescriptionAppliesTo
      };

      this.store.dispatch(new fromJobDescriptionListActions.SaveCompanyJobsJobDescriptionTemplateId({
        companyJobIdsToAssign: [newJobDescription.CompanyJobId],
        passThroughParameters
      }));
    }
  }

  getQueryListStateRequest() {
    return {
      Query: this.listFilter,
      ListState: JSON.stringify(this.gridState)
    };
  }

  handleBulkExportPopoverOpened() {
    this.store.dispatch(new fromBulkExportPopoverActions.OpenBulkExportPopover(this.getQueryListStateRequest()));
  }

  handleClearAllFilters() {
    this.gridState.filter.filters = [];
    this.gridState.skip = 0;
    this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
  }

  handleClearFilter(filterDescriptor: FilterDescriptor) {
    const currentFilters: Array<any> = this.gridState.filter.filters;

    this.filterThrottle.next(currentFilters.filter(f => f.field !== filterDescriptor.field));
  }

  handleColumnModified(listAreaColumnModifiedObj: any) {
    const request = {
      ListAreaColumn: listAreaColumnModifiedObj.listAreaColumn,
      Checked: listAreaColumnModifiedObj.checked
    };
    this.store.dispatch(new fromJobDescriptionGridActions.UpdateListAreaColumn(request));
  }

  handleCreateCompanyJobComplete(complete: any) {
    if (complete.addAndAssign) {
      const newJobDescription = new CompanyJobViewListItem();
      newJobDescription.CompanyJobId = complete.companyJobId;
      newJobDescription.JobDescriptionStatus = 'Not Started';

      this.store.dispatch(new fromJobDescriptionListActions.CreateJobDescription({ companyJobViewListItem: newJobDescription }));
    } else {
      this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
    }
  }

  handleFilterChanged(filters: FilterDescriptor[]) {
    this.filterThrottle.next(filters);
  }

  handlePageChanged(event: PageChangeEvent) {
    this.gridState.skip = event.skip;
    this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
  }

  handleSaveColumns(listAreaColumns: ListAreaColumn[]) {
    this.store.dispatch(new fromJobDescriptionGridActions.SaveListAreaColumns({ Columns: listAreaColumns }));
  }

  handleSortChanged(sort: SortDescriptor[]) {
    this.gridState.sort = sort;
    this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
  }

  handleSaveFilterModalOpened() {
    this.store.dispatch(new fromUserFilterActions.LoadUserFilterList());
  }

  handleTemplateAssignedToJob(assignTemplateToJobObj: any) {
    const companyJobIdsToAssign = [assignTemplateToJobObj.selectedCompanyJob.CompanyJobId];
    const passThroughParameters = assignTemplateToJobObj;
    this.store.dispatch(new fromJobDescriptionListActions.SaveCompanyJobsJobDescriptionTemplateId({
      companyJobIdsToAssign,
      passThroughParameters
    }));
  }

  handleUserFilterDeleteConfirmed(id: string) {
    this.store.dispatch(new fromUserFilterActions.DeleteUserFilter(id));
  }

  handleUserFilterListPopoverOpened() {
    this.store.dispatch(new fromUserFilterActions.LoadUserFilterList());
  }

  handleUserFilterSelected(userFilter: JdmListFilter) {
    const filters: any[] = userFilter.CompositeFilter.filters;
    const allColumns: string[] = this.displayedListAreaColumnNames.concat(
      this.customListAreaColumns.map(lac => lac.ColumnDatabaseName));

    this.filterThrottle.next(filters.filter(f => !!allColumns.find(c => c === f.field)));
  }

  handleViewSelectionChangedOnBulkExport(viewName: string) {
    this.store.dispatch(new fromBulkExportPopoverActions.LoadControlLabels(viewName));
    this.store.dispatch(new fromJobInformationFieldsActions.LoadJobInformationFieldsForBulkExport(viewName));
  }

  openAssignJobModal(selectedCompanyJob: CompanyJobViewListItem) {
    this.selectedCompanyJobForModal = selectedCompanyJob;
    this.assignJobToTemplateModalComponent.open();
  }

  openJobDescriptionHistoryModal(jobDescriptionIdObj: any) {
    this.jobDescriptionHistoryModalComponent.open(jobDescriptionIdObj.jobDescriptionId, jobDescriptionIdObj.jobTitle);
  }

  openNewJobDescModal(selectedCompanyJob: CompanyJobViewListItem) {
    this.selectedCompanyJobForModal = selectedCompanyJob;
    this.jobDescriptionAppliesToModalComponent.open(selectedCompanyJob.JobDescriptionId, selectedCompanyJob.CompanyJobId);
  }

  saveFilterClicked() {
    this.saveFilterModalComponent.open();
  }

  saveFilterHandler(filterName) {
    const gridFilter = this.gridState.filter;
    const request = {
      Id: null,
      Name: filterName,
      CompositeFilter: PayfactorsApiModelMapper.mapCompositeFilterToCompositeUppercase(gridFilter)
    };

    this.store.dispatch(new fromUserFilterActions.AddUserFilter(request));
    this.saveFilterModalComponent.close();
  }

  updateSearchFilter(newSearchTerm: string) {
    this.listFilter = newSearchTerm;
    this.gridState.skip = 0;

    this.store.dispatch(new fromJobDescriptionGridActions.UpdateSearchTerm(newSearchTerm));
    this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
  }

  private initFilterThrottle() {
    const filterThrottle$ = this.filterThrottle.pipe(debounceTime(400));

    filterThrottle$.subscribe(filters => {
      if (filters) {
        this.gridState.filter = {
          filters: filters,
          logic: 'and'
        };

        // Upon filter changes reset to page 1
        this.gridState.skip = 0;

        this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
      }
    });
  }

  private initializeSubscriptions() {

    this.listAreaColumnsSubscription = this.listAreaColumns$.subscribe(lac => {
      if (lac) {
        this.displayedListAreaColumnNames = lac.map(l => l.ColumnDatabaseName);
        this.nonStaticListAreaColumns = lac.filter(l => !l.Required);
      }
    });

    this.savingListAreaColumnsSuccessSubscription = this.savingListAreaColumnsSuccess$.subscribe((isSuccess) => {
      if (isSuccess) {
        this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
      }
    });
  }

  public navigateToJobDescription(companyJobViewListItem: CompanyJobViewListItem) {
    const canEditJobDescription: boolean = this.permissionService.CheckPermission([Permissions.CAN_EDIT_JOB_DESCRIPTION],
      PermissionCheckEnum.Single);

    // Coming from grid, not started and assigned a template, create the job description
    if (canEditJobDescription && companyJobViewListItem.JobDescriptionStatus === 'Not Started' &&
      companyJobViewListItem.CompanyJobDescriptionTemplateId &&
      !companyJobViewListItem.JobDescriptionId) {
      this.store.dispatch(new fromJobDescriptionListActions.CreateJobDescription({ companyJobViewListItem }));
      return;
    }

    // coming from grid, template is not assigned, show template assignment modal
    if (canEditJobDescription && !companyJobViewListItem.CompanyJobDescriptionTemplateId && !this.isPublic) {
      this.openAssignJobModal(companyJobViewListItem);
      return;
    }

    // User doesn't have permission to create JD from not started state, only route if there's a valid ID. If user clicked not started JD
    // without permission, do nothing
    if (companyJobViewListItem.JobDescriptionId) {
      this.routeToJobDescription(companyJobViewListItem.JobDescriptionId);
    }
  }

  private populateSavedData() {
    this.savedSearchTerm$.subscribe(savedSearchTerm => {
      this.savedSearchTerm = savedSearchTerm || '';
      this.listFilter = savedSearchTerm || '';
    });

    this.gridStateSubscription = this.savedGridState$.subscribe(savedGridState => this.gridState = cloneDeep(savedGridState));
  }

  private routeToJobDescription(jobDescriptionId: number) {
    if (this.tokenId) {
      const jwtValue = this.tokenId;
      this.router.navigate([`job-descriptions/${jobDescriptionId}`],
        { queryParams: { jwt: jwtValue, viewName: JobDescriptionViewConstants.PUBLIC_VIEW } });
    } else {
      this.router.navigate([`job-descriptions/${jobDescriptionId}`]);
    }
  }

  ngOnDestroy() {
    this.listAreaColumnsSubscription.unsubscribe();
    this.routerParmsSubscription.unsubscribe();
    this.savingListAreaColumnsSuccessSubscription.unsubscribe();
    this.gridStateSubscription.unsubscribe();
  }

  ngOnInit() {
    this.routerParmsSubscription = this.route
      .queryParams
      .subscribe(params => {
        this.tokenId = params['jwt'];
      });

    this.identity$.subscribe(identity => {
      this.isPublic = identity.IsPublic;
      this.publicCompanyId = identity.CompanyId;
    });

    const request = {
      ListAreaName: 'JobDescriptionManagement',
      UdfType: 'jobs'
    };

    if (this.isPublic) {
      this.store.dispatch(new fromJobDescriptionGridActions.LoadPublicJdmColumns(this.publicCompanyId));

      // settings aren't loaded in public views, so initiate that here, then redirect to the NG implementation if the client specific setting is off
      this.store.dispatch(new fromCompanySettingsActions.LoadCompanySettings());

      this.enablePublicViewsInClient$.pipe(
        takeWhile((setting) => setting !== true),
        filter(setting => setting === false)
      ).subscribe(() => window.location.href = window.location.href.replace(`/${environment.hostPath}/`, environment.ngAppRoot));

    } else {
      this.store.dispatch(new fromJobDescriptionGridActions.LoadListAreaColumns(request));
    }

    this.populateSavedData();
    this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
    this.initFilterThrottle();

    this.initializeSubscriptions();
  }
}

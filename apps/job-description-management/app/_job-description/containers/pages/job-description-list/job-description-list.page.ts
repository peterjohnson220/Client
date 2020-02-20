import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';
import { debounceTime, takeWhile, filter } from 'rxjs/operators';

import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import { JdmListFilter } from 'libs/models/user-profile';
import { ListAreaColumn } from 'libs/models/common';
import { UserContext } from 'libs/models/security';
import { CompanySettingsEnum } from 'libs/models';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { SettingsService } from 'libs/state/app-context/services';
import { environment } from 'environments/environment';
import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import { AppNotification, NotificationLevel, NotificationPayload, NotificationType } from 'libs/features/app-notifications/models';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';

import * as fromBulkExportPopoverActions from '../../../actions/bulk-export-popover.actions';
import * as fromJobDescriptionListActions from '../../../actions/job-description-list.actions';
import * as fromJobDescriptionGridActions from '../../../actions/job-description-grid.actions';
import * as fromJobInformationFieldsActions from '../../../actions/job-information-fields.actions';
import * as fromUserFilterActions from '../../../actions/user-filter.actions';
import * as fromJobDescriptionReducers from '../../../reducers';
import { AssignJobsToTemplateModalComponent, JobDescriptionHistoryModalComponent } from '../../../components';
import { CompanyJobViewListItem } from '../../../models';
import { AvailableJobInformationField, ControlLabel } from '../../../../shared/models';
import { JobDescriptionViewConstants } from '../../../../shared/constants/job-description-view-constants';
import { SaveFilterModalComponent } from '../../../components/modals/save-filter';
import { PayfactorsApiModelMapper } from '../../../../shared/helpers';
import { AddJobModalComponent } from '../../../components/modals/add-job';
import { JobDescriptionBulkExportPayload } from '../../../models/job-description-bulk-export-payload.model';
import {
  JobDescriptionAppliesToModalComponent
} from '../../../../shared/components/modals/job-description-applies-to';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pf-job-description-list-page',
  templateUrl: './job-description-list.page.html',
  styleUrls: ['./job-description-list.page.scss']
})
export class JobDescriptionListPageComponent implements OnInit, OnDestroy {
  @ViewChild(AddJobModalComponent, { static: true }) public addJobModalComponent: AddJobModalComponent;
  @ViewChild(AssignJobsToTemplateModalComponent, { static: true }) public assignJobToTemplateModalComponent: AssignJobsToTemplateModalComponent;
  @ViewChild(JobDescriptionAppliesToModalComponent, { static: true }) public jobDescriptionAppliesToModalComponent: JobDescriptionAppliesToModalComponent;
  @ViewChild(JobDescriptionHistoryModalComponent, { static: true }) public jobDescriptionHistoryModalComponent: JobDescriptionHistoryModalComponent;
  @ViewChild(SaveFilterModalComponent, { static: true }) public saveFilterModalComponent: SaveFilterModalComponent;

  public bulkExportControlLabels$: Observable<ControlLabel[]>;
  public bulkExportControlLabelsLoading$: Observable<boolean>;
  public bulkExportNoPublishedJobDescriptions$: Observable<boolean>;
  public canRestrictJobDescriptionFromPublicView: boolean;
  public customListAreaColumns: ListAreaColumn[] = [];
  public displayedListAreaColumnNames: string[];
  public filterThrottle: Subject<any>;
  public gridDataResult$: Observable<GridDataResult>;
  public gridLoading$: Observable<boolean>;
  public gridLoadingError$: Observable<boolean>;
  public gridState: State;
  public identity$: Observable<UserContext>;
  public isPublic: boolean;
  public jobDescriptionListViews$: Observable<string[]>;
  public jobDescriptionListViewsLoading$: Observable<boolean>;
  public jobInformationFields$: Observable<AvailableJobInformationField[]>;
  public jobInformationFieldsLoading$: Observable<boolean>;
  public listAreaColumns$: Observable<ListAreaColumn[]>;
  public listFilter: string;
  public nonStaticListAreaColumns: ListAreaColumn[];
  public permissions = Permissions;
  public publicCompanyId: number;
  public savedSearchTerm: string;
  public selectedCompanyJobForModal: CompanyJobViewListItem;
  public showFilterSidebar: any;
  public tokenId: string;
  public userFilterDeleting$: Observable<boolean>;
  public userFilterError$: Observable<boolean>;
  public userFilterErrorMessage$: Observable<string>;
  public userFilterList$: Observable<JdmListFilter[]>;
  public userFilterListAdding$: Observable<boolean>;
  public userFilterListLoading$: Observable<boolean>;

  private bulkExportError$: Observable<boolean>;
  private bulkExportErrorSubscription: Subscription;
  private enablePublicViewsInClient$: Observable<boolean>;
  private gridStateSubscription: Subscription;
  private listAreaColumnsSubscription: Subscription;
  private routerParmsSubscription: Subscription;
  private savedGridState$: Observable<State>;
  private savedSearchTerm$: Observable<string>;
  private savingListAreaColumnsSuccess$: Observable<boolean>;
  private savingListAreaColumnsSuccessSubscription: Subscription;

  notification: { error: AppNotification<NotificationPayload> } = {
    error: {
      NotificationId: '',
      Level: NotificationLevel.Error,
      From: 'Job Description Bulk Exporter',
      Payload: {
        Title: 'Job Description Bulk Export Failure',
        Message: 'Your bulk export has failed. If this error persists, please contact Payfactors support for assistance.'
      },
      EnableHtml: true,
      Type: NotificationType.Event
    }
  };

  constructor(
    private notificationStore: Store<fromAppNotificationsMainReducer.State>,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private store: Store<fromJobDescriptionReducers.State>,
  ) {
    this.bulkExportControlLabels$ = this.store.select(fromJobDescriptionReducers.getControlLabels);
    this.bulkExportControlLabelsLoading$ = this.store.select(fromJobDescriptionReducers.getControlLabelsLoading);
    this.bulkExportError$ = this.store.select(fromJobDescriptionReducers.getBulkExportError);
    this.bulkExportNoPublishedJobDescriptions$ = this.store.select(fromJobDescriptionReducers.getNoPublishedJobDescriptions);
    this.enablePublicViewsInClient$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.JDMPublicViewsUseClient);
    this.enablePublicViewsInClient$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.JDMPublicViewsUseClient);
    this.gridDataResult$ = this.store.select(fromJobDescriptionReducers.getGridDataResult);
    this.gridLoading$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionGridLoading);
    this.gridLoadingError$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionGridLoadingError);
    this.identity$ = this.store.select(fromRootState.getUserContext);
    this.jobDescriptionListViews$ = this.store.select(fromJobDescriptionReducers.getViewNames);
    this.jobDescriptionListViews$ = this.store.select(fromJobDescriptionReducers.getViewNames);
    this.jobDescriptionListViewsLoading$ = this.store.select(fromJobDescriptionReducers.getViewNamesLoading);
    this.jobDescriptionListViewsLoading$ = this.store.select(fromJobDescriptionReducers.getViewNamesLoading);
    this.jobInformationFields$ = this.store.select(fromJobDescriptionReducers.getJobInformationFieldsForBulkExport);
    this.jobInformationFields$ = this.store.select(fromJobDescriptionReducers.getJobInformationFieldsForBulkExport);
    this.jobInformationFieldsLoading$ = this.store.select(fromJobDescriptionReducers.getJobInformationFieldsForBulkExportLoading);
    this.jobInformationFieldsLoading$ = this.store.select(fromJobDescriptionReducers.getJobInformationFieldsForBulkExportLoading);
    this.listAreaColumns$ = this.store.select(fromJobDescriptionReducers.getListAreaColumns);
    this.savedGridState$ = this.store.select(fromJobDescriptionReducers.getGridState);
    this.savedSearchTerm$ = this.store.select(fromJobDescriptionReducers.getSearchTerm);
    this.savingListAreaColumnsSuccess$ = this.store.select(fromJobDescriptionReducers.getListAreaColumnsSavingSuccess);
    this.savingListAreaColumnsSuccess$ = this.store.select(fromJobDescriptionReducers.getListAreaColumnsSavingSuccess);
    this.userFilterDeleting$ = this.store.select(fromJobDescriptionReducers.getUserFilterDeleting);
    this.userFilterError$ = this.store.select(fromJobDescriptionReducers.getUserFilterError);
    this.userFilterErrorMessage$ = this.store.select(fromJobDescriptionReducers.getUserFilterErrorMessage);
    this.userFilterList$ = this.store.select(fromJobDescriptionReducers.getUserFilterList);
    this.userFilterListAdding$ = this.store.select(fromJobDescriptionReducers.getUserFilterAdding);
    this.userFilterListLoading$ = this.store.select(fromJobDescriptionReducers.getUserFilterLoading);

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
      DisableDropdown: true,
      PublicView: true
    });
  }

  ngOnInit() {
    this.createSubscriptions();
    this.initFilterThrottle();
    this.subscribe();

    const request = {
      ListAreaName: 'JobDescriptionManagement',
      UdfType: 'jobs'
    };

    this.canRestrictJobDescriptionFromPublicView = this.permissionService.CheckPermission(
      [Permissions.CAN_RESTRICT_JOB_DESCRIPTIONS_FROM_THE_PUBLIC_VIEW], PermissionCheckEnum.Single
      );

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

    this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
  }

  ngOnDestroy() {
    this.unsubscribe();
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

  handleCreateCompanyJobComplete(complete: any) {
    if (complete.addAndAssign) {
      const newJobDescription = new CompanyJobViewListItem();
      newJobDescription.CompanyJobId = complete.companyJobId;
      newJobDescription.JobDescriptionStatus = 'Not Started';
      newJobDescription.PublicView = complete.publicView;

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

  handlePublicViewChanged(jobDescription: any) {
    this.store.dispatch(new fromJobDescriptionGridActions.UpdatePublicView(jobDescription));
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

  handleExported(payload: JobDescriptionBulkExportPayload) {
    this.store.dispatch(new fromBulkExportPopoverActions.BulkExport(payload));
  }

  navigateToJobDescription(companyJobViewListItem: CompanyJobViewListItem) {
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

  private createSubscriptions() {
    this.routerParmsSubscription = this.route
      .queryParams
      .subscribe(params => {
        this.tokenId = params['jwt'];
      });

    this.listAreaColumnsSubscription = this.listAreaColumns$.subscribe(lac => {
        this.displayedListAreaColumnNames = lac.map(l => l.ColumnDatabaseName);
    });

    this.savingListAreaColumnsSuccessSubscription = this.savingListAreaColumnsSuccess$.subscribe((isSuccess) => {
      if (isSuccess) {
        this.store.dispatch(new fromJobDescriptionGridActions.LoadJobDescriptionGrid(this.getQueryListStateRequest()));
      }
    });

    this.bulkExportErrorSubscription = this.bulkExportError$.subscribe((error) => {
      if (error) {
        this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(this.notification.error));
        this.store.dispatch(new fromBulkExportPopoverActions.ResetBulkExportError());
      }
    });

    this.gridStateSubscription = this.savedGridState$.subscribe(savedGridState => this.gridState = cloneDeep(savedGridState));
  }

  private subscribe() {
    this.identity$.subscribe(identity => {
      this.isPublic = identity.IsPublic;
      this.publicCompanyId = identity.CompanyId;
    });

    this.savedSearchTerm$.subscribe(savedSearchTerm => {
      this.savedSearchTerm = savedSearchTerm || '';
      this.listFilter = savedSearchTerm || '';
    });
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

  private unsubscribe() {
    this.listAreaColumnsSubscription.unsubscribe();
    this.routerParmsSubscription.unsubscribe();
    this.savingListAreaColumnsSuccessSubscription.unsubscribe();
    this.gridStateSubscription.unsubscribe();
    this.bulkExportErrorSubscription.unsubscribe();
  }
}

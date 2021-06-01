import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { first, debounceTime, tap } from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';

import * as signalR from '@microsoft/signalr';
import { LogLevel } from '@microsoft/signalr';

import {
  JobDescription,
  UserContext,
  CompanySettingsEnum,
  AsyncStateObj,
  ControlType,
  ControlTypeAttribute,
  SimpleYesNoModalOptions,
  UserAssignedRole,
  JobDescriptionSection,
  CompanyDto,
  showSection
} from 'libs/models';
import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants/permissions';
import { SimpleYesNoModalComponent, FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';
import { JobDescriptionManagementDnDService, JobDescriptionManagementService, SortDirection } from 'libs/features/jobs/job-description-management';
import {
  JobDescriptionLibraryBucket,
  JobDescriptionLibraryResult,
  LibrarySearchRequest,
  JobDescriptionAppliesTo,
  JobDescriptionExtendedInfo
} from 'libs/features/jobs/job-description-management';
import * as fromJobDescriptionLibraryActions from 'libs/features/jobs/job-description-management/actions/job-description-library.actions';
import * as fromCompanyLogoActions from 'libs/features/jobs/job-description-management/actions/company-logo.actions';
import * as fromJobDescriptionManagementSharedReducer from 'libs/features/jobs/job-description-management/reducers';
import * as fromWorkflowTemplateListActions from 'libs/features/jobs/job-description-management/actions/shared-workflow.actions';
import * as fromHeaderActions from 'libs/ui/layout-wrapper/actions/header.actions';
import * as fromControlTypesActions from 'libs/features/jobs/job-description-management/actions/control-types.actions';
import { JobDescriptionConstants } from 'libs/features/jobs/job-description-management/constants/job-description-constants';
import { JobDescriptionManagementDndSource, JobDescriptionViewConstants } from 'libs/features/jobs/job-description-management/constants';

import { EmployeeAcknowledgement, ExportData, JobDescriptionLibraryDropModel, WorkflowSetupModalInput } from '../../../models';
import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromJobDescriptionActions from '../../../actions/job-description.actions';
import * as fromEmployeeAcknowledgementActions from '../../../actions/employee-acknowledgement.actions';
import * as fromWorkflowActions from '../../../actions/workflow.actions';
import { JobDescriptionDnDService } from '../../../services';
import {
  EmployeeAcknowledgementModalComponent, ExportJobDescriptionModalComponent,
  WorkflowCancelModalComponent, WorkflowStepCompletionModalComponent
} from '../../../components/modals';
import { FlsaQuestionnaireModalComponent } from '../../../components/modals/flsa-questionnaire';
import { JobMatchesModalComponent } from '../../job-matches-modal';
import { ChangeApproverModalComponent } from '../../change-approver-modal';
import { CopyJobDescriptionModalComponent } from '../../copy-job-description-modal';
import { WorkflowSetupModalComponent } from '../../workflow-setup-modal';
import { JobDescriptionAppliesToModalComponent } from 'apps/job-description-management/app/shared';


@Component({
  selector: 'pf-job-description-page',
  templateUrl: './job-description.page.html',
  styleUrls: ['./job-description.page.scss']
})
export class JobDescriptionPageComponent implements OnInit, OnDestroy {
  @ViewChild('discardDraftModal', { static: true }) public discardDraftModal: SimpleYesNoModalComponent;
  @ViewChild('jobMatchesModalComponent') public jobMatchesModalComponent: JobMatchesModalComponent;
  @ViewChild(ChangeApproverModalComponent) public changeApproverModal: ChangeApproverModalComponent;
  @ViewChild(CopyJobDescriptionModalComponent) public copyJobDescriptionModal: CopyJobDescriptionModalComponent;
  @ViewChild(EmployeeAcknowledgementModalComponent, {static: true }) public employeeAcknowledgementModal: EmployeeAcknowledgementModalComponent;
  @ViewChild(ExportJobDescriptionModalComponent, { static: true }) public exportJobDescriptionModalComponent: ExportJobDescriptionModalComponent;
  @ViewChild(FlsaQuestionnaireModalComponent, { static: true }) public flsaQuestionnaireModal: FlsaQuestionnaireModalComponent;
  @ViewChild(JobDescriptionAppliesToModalComponent) public jobDescriptionAppliesToModalComponent: JobDescriptionAppliesToModalComponent;
  @ViewChild(WorkflowCancelModalComponent) public workflowCancelModal: WorkflowCancelModalComponent;
  @ViewChild(WorkflowSetupModalComponent) public workflowSetupModal: WorkflowSetupModalComponent;
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) public fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;
  @ViewChild(WorkflowStepCompletionModalComponent) public workflowStepCompletionModal: WorkflowStepCompletionModalComponent;

  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  jobDescriptionPublishingSuccess$: Observable<boolean>;
  identity$: Observable<UserContext>;
  userAssignedRoles$: Observable<UserAssignedRole[]>;
  company$: Observable<CompanyDto>;
  requireSSOLogin$: Observable<boolean>;
  controlTypesAsync$: Observable<AsyncStateObj<ControlType[]>>;
  editingJobDescription$: Observable<boolean>;
  savingJobDescription$: Observable<boolean>;
  jobDescriptionLibraryBuckets$: Observable<AsyncStateObj<JobDescriptionLibraryBucket[]>>;
  jobDescriptionLibraryResults$: Observable<AsyncStateObj<JobDescriptionLibraryResult[]>>;
  jobDescriptionExtendedInfo$: Observable<JobDescriptionExtendedInfo>;
  acknowledging$: Observable<boolean>;
  employeeAcknowledgementInfo$: Observable<AsyncStateObj<EmployeeAcknowledgement>>;
  employeeAcknowledgementErrorMessage$: Observable<string>;
  jobDescriptionViewsAsync$: Observable<AsyncStateObj<string[]>>;
  completedStep$: Observable<boolean>;
  gettingJobDescriptionExtendedInfoSuccess$: Observable<AsyncStateObj<boolean>>;
  discardingDraftJobDescriptionSuccess$: Observable<boolean>;
  enableFileDownloadSecurityWarning$: Observable<boolean>;

  loadingPage$: Observable<boolean>;
  loadingPageError$: Observable<boolean>;
  undoChanges$: Observable<boolean>;
  replaceContents$: Observable<boolean>;
  workflowStepInfo$: Observable<any>;
  inSystemWorkflowStepCompletionModalOpen$: Observable<any>;

  jobDescriptionSubscription: Subscription;
  routerParamsSubscription: Subscription;
  identitySubscription: Subscription;
  companySubscription: Subscription;
  saveThrottleSubscription: Subscription;
  savingJobDescriptionSubscription: Subscription;
  jobDescriptionExtendedInfoSubscription: Subscription;
  userAssignedRolesSubscription: Subscription;
  saveThrottle: Subject<any>;
  jobDescriptionViewsAsyncSubscription: Subscription;
  editingSubscription: Subscription;
  publishingSuccessSubscription: Subscription;
  completedStepSubscription: Subscription;
  controlTypesSubscription: Subscription;
  requireSSOLoginSubscription: Subscription;
  discardingDraftJobDescriptionSuccessSubscription: Subscription;
  enableFileDownloadSecurityWarningSub: Subscription;
  workflowStepInfoSubscription: Subscription;
  workflowStepCompletionModalSubscription: Subscription;

  companyName: string;
  emailAddress: string;
  companyLogoPath: string;
  jobDescription: JobDescription;
  visibleSections: JobDescriptionSection[];
  enableFileDownloadSecurityWarning: boolean;
  enableLibraryForRoutedJobDescriptions: boolean;
  exportData: ExportData;
  hasCanEditJobDescriptionPermission: boolean;
  identityInWorkflow: boolean;
  saving: boolean;
  discardDraftModalOptions: SimpleYesNoModalOptions;
  showLibrary = false;
  showRoutingHistory = false;
  jobDescriptionIsFullscreen = false;
  isFirstSave = true;
  queueSave = false;
  jobDescriptionId: number;
  viewName: string;
  revisionNumber: number;
  tokenId: string;
  ssoTokenId: string;
  ssoAgentId: string;
  identity: UserContext;
  identityInEmployeeAcknowledgement: boolean;
  isSiteAdmin = false;
  isCompanyAdmin = false;
  inHistory: boolean;
  jobDescriptionDisplayName: string;
  jobDescriptionViews: string[];
  completedStep: boolean;
  controlTypes: ControlType[];
  isInSystemWorkflow: boolean;

  get isJobDescriptionEditable() {
    return this.identityInWorkflow ? this.hasCanEditJobDescriptionPermission :
    this.hasCanEditJobDescriptionPermission && this.jobDescription?.JobDescriptionStatus === 'Draft';
  }

  get workflowSetupModalInput(): WorkflowSetupModalInput[]  {
    return [{EntityId:  this.jobDescription?.JobDescriptionId,
      JobTitle: this.jobDescription?.Name,
      Revision: this.jobDescription?.JobDescriptionRevision,
      JobId: this.jobDescription?.CompanyJobId }];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromJobDescriptionReducers.State>,
    private userContextStore: Store<fromRootState.State>,
    private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
    private settingsService: SettingsService,
    private permissionService: PermissionService,
    private jobDescriptionManagementService: JobDescriptionManagementService,
    private jobDescriptionManagementDndService: JobDescriptionManagementDnDService,
    private jobDescriptionDnDService: JobDescriptionDnDService
) {
    this.company$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getCompany);
    this.jobDescriptionAsync$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionAsync);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.userAssignedRoles$ = this.userContextStore.select(fromRootState.getUserAssignedRoles);
    this.enableFileDownloadSecurityWarning$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);

    this.requireSSOLogin$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.JDMExternalWorkflowsRequireSSOLogin
    );

    this.controlTypesAsync$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypesAsync);
    this.editingJobDescription$ = this.store.select(fromJobDescriptionReducers.getEditingJobDescription);
    this.savingJobDescription$ = this.store.select(fromJobDescriptionReducers.getSavingJobDescription);
    this.jobDescriptionLibraryBuckets$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getBucketsAsync);
    this.jobDescriptionLibraryResults$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getResultsAsync);
    this.jobDescriptionExtendedInfo$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionExtendedInfo);
    this.gettingJobDescriptionExtendedInfoSuccess$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionExtendedInfoAsync);
    this.jobDescriptionPublishingSuccess$ = this.store.select(fromJobDescriptionReducers.getPublishingJobDescriptionSuccess);
    this.acknowledging$ = this.store.select(fromJobDescriptionReducers.getAcknowledging);
    this.employeeAcknowledgementInfo$ = this.store.select(fromJobDescriptionReducers.getEmployeeAcknowledgementAsync);
    this.employeeAcknowledgementErrorMessage$ = this.store.select(fromJobDescriptionReducers.getEmployeeAcknowledgementErrorMessage);
    this.jobDescriptionViewsAsync$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionViewsAsync);
    this.completedStep$ = this.store.select(fromJobDescriptionReducers.getCompletedStep);
    this.discardingDraftJobDescriptionSuccess$ = this.store.select(fromJobDescriptionReducers.getDiscardingDraftJobDescriptionSuccess);

    this.saveThrottle = new Subject();

    this.loadingPage$ = this.store.select(fromJobDescriptionReducers.getLoadingPage);
    this.loadingPageError$ = this.store.select(fromJobDescriptionReducers.getLoadingPageError);

    this.undoChanges$ = this.store.select(fromJobDescriptionReducers.getUndoJobDescriptionChangesComplete);
    this.replaceContents$ = this.store.select(fromJobDescriptionReducers.getReplaceJobDescriptionComplete);
    this.workflowStepInfo$ = this.store.select(fromJobDescriptionReducers.getWorkflowStepInfo);
    this.inSystemWorkflowStepCompletionModalOpen$ = this.store.select(fromJobDescriptionReducers.getInSystemWorkflowStepCompletionModalOpen);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromJobDescriptionActions.LoadingPage(true));
    this.initRouterParams();
    this.initSaveThrottle();
    this.defineDiscardDraftModalOptions();
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromJobDescriptionActions.ClearJobDescription());
    this.sharedStore.dispatch(new fromControlTypesActions.ResetControlTypes());
    this.routerParamsSubscription.unsubscribe();
    this.jobDescriptionSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
    this.companySubscription.unsubscribe();
    this.saveThrottleSubscription.unsubscribe();
    this.savingJobDescriptionSubscription.unsubscribe();
    this.jobDescriptionExtendedInfoSubscription.unsubscribe();
    this.jobDescriptionManagementDndService.destroyJobDescriptionManagementDnD();
    this.jobDescriptionDnDService.destroyJobDescriptionPageDnD();
    this.jobDescriptionViewsAsyncSubscription.unsubscribe();
    this.editingSubscription.unsubscribe();
    this.completedStepSubscription.unsubscribe();
    this.requireSSOLoginSubscription.unsubscribe();
    this.publishingSuccessSubscription.unsubscribe();
    this.discardingDraftJobDescriptionSuccessSubscription.unsubscribe();
    this.enableFileDownloadSecurityWarningSub.unsubscribe();
    this.controlTypesSubscription.unsubscribe();
    this.workflowStepInfoSubscription?.unsubscribe();
    this.workflowStepCompletionModalSubscription?.unsubscribe();
  }

  appliesToFormCompleted(selected: any) {
    this.store.dispatch(new fromJobDescriptionActions.UpdateJobDescriptionAppliesToValues(selected.jobDescriptionAppliesTo));
    this.saveThrottle.next(true);
  }

  goBack(): void {
    if (!!this.identity && (this.identity.IsPublic || this.identity.WorkflowStepInfo)) {

      if (!this.ssoTokenId || !this.ssoAgentId) {
        this.router.navigate(['/'], { queryParams: { jwt: this.tokenId } });
      } else {
        this.router.navigate(['/'], { queryParams: { jwt: this.tokenId,
            tokenid: this.ssoTokenId, agentid: this.ssoAgentId } });
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  acknowledgeJobDescription(signature: string) {
    this.store.dispatch(new fromEmployeeAcknowledgementActions.Acknowledge({signature: signature}));
    this.employeeAcknowledgementModal.close();
  }

  handleControlDataChanges(changeObj: any) {
    this.store.dispatch(new fromJobDescriptionActions.UpdateControlData({ changeObj }));
    this.saveThrottle.next(true);
  }

  handleBulkControlDataChanges(bulkChangeObj: any) {
    const dataRows = this.getDataRowsForReplaceControlData(bulkChangeObj.attributes, bulkChangeObj.bulkData);
    this.store.dispatch(new fromJobDescriptionActions.ReplaceControlData({
      jobDescriptionControl: bulkChangeObj.control,
      dataRows
    }));
    this.saveThrottle.next(true);
  }

  handleControlAdditionalPropertiesChangesDetected(eventArgs: any) {
    this.store.dispatch(new fromJobDescriptionActions.UpdateControlAdditionalProperties({
      jobDescriptionControl: eventArgs.control,
      additionalProperties: eventArgs.additionalProperties
    }));

    this.saveThrottle.next(true);
  }

  handleControlDataRowAdded(addDataRowObj: any) {
    this.store.dispatch(new fromJobDescriptionActions.AddDataRowToControl({
      jobDescriptionControl: addDataRowObj.control,
      dataRow: this.jobDescriptionManagementService.createDataRow(addDataRowObj.attributes),
      save: addDataRowObj.save
    }));

    if (addDataRowObj.save) {
      this.saveThrottle.next(true);
    }
  }

  handleCancelApprovalConfirmed(cancelReason: string) {
    this.jobDescriptionExtendedInfo$.pipe(first()).subscribe(jdei => {
      this.store.dispatch(new fromWorkflowActions.CancelApproval({
        WorkflowId: jdei.WorkflowId,
        Comment: cancelReason
      }));
    });
  }

  toggleLibrary() {
    this.handleShowLibrary(!this.showLibrary);
  }

  handleControlDataRowDeleted(dataRowDeletedObj: any) {
    this.store.dispatch(new fromJobDescriptionActions.RemoveControlDataRow({
      jobDescriptionControl: dataRowDeletedObj.jobDescriptionControl,
      dataRowId: dataRowDeletedObj.dataRowId
    }));

    this.saveThrottle.next(true);
  }

  saveJobDescription(undo: boolean = false) {
    this.store.dispatch(new fromJobDescriptionActions.SaveJobDescription({
      jobDescription: this.jobDescription,
      isFirstSave: this.isFirstSave,
      undo
    }));
    this.isFirstSave = false;
  }

  handleLibrarySearchChange(searchRequest: LibrarySearchRequest) {
    searchRequest.JobDescriptionId = this.jobDescription.JobDescriptionId;
    this.store.dispatch(new fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResultsByBucket(searchRequest));
  }

  handleLibraryPageChange(searchRequest: LibrarySearchRequest) {
    searchRequest.JobDescriptionId = this.jobDescription.JobDescriptionId;
    this.store.dispatch(new fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResults(searchRequest));
  }

  handleLibraryTabChange(searchRequest: LibrarySearchRequest) {
    searchRequest.JobDescriptionId = this.jobDescription.JobDescriptionId;
    this.store.dispatch(new fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResults(searchRequest));
  }

  handleShowLibrary(shouldShow: boolean) {
    this.showLibrary = shouldShow;
    if (shouldShow) {
      this.initializeLibrary();
    }
  }

  handlePublishClicked(): void {
    this.showLibrary = false;
    this.showRoutingHistory = false;
  }

  handleRouteForApprovalClicked(): void {
    if ( !this.identity.IsPublic && this.jobDescription) {
      this.store.dispatch(new fromWorkflowTemplateListActions.Load([this.jobDescription.CompanyJobId]));
    }
    this.workflowSetupModal.open();
  }

  handleDiscardDraftClicked(): void {
    this.discardDraftModal.open({});
    this.isFirstSave = true;
  }

  handleEditClicked(): void {
    this.showRoutingHistory = false;
    this.saveJobDescription(true); // put JD in draft state;
  }

  handlePriceJobClicked(): void {
    this.jobMatchesModalComponent.open();
  }

  handleCancelApprovalClicked(): void {
    this.workflowCancelModal.open();
  }

  handleChangeApproverClicked(e: any): void {
    this.changeApproverModal.open(e.isLastStep, e.currentStepUserName);
  }

  handleCopyFromClicked(): void {
    this.copyJobDescriptionModal.open();
  }

  handleFLSAClicked(): void {
    this.flsaQuestionnaireModal.open();
  }

  handleRoutingHistoryClicked(): void {
    this.showRoutingHistory = true;
    this.showLibrary = false;
  }

  handleUpdateJobInfoClicked(): void {
    const appliesTo = new JobDescriptionAppliesTo();
    appliesTo.AppliesToField = this.jobDescription.AppliesToField;
    appliesTo.AppliesToValue = this.jobDescription.AppliesToValue;
    appliesTo.JobDescriptionTitle = this.jobDescription.JobDescriptionTitle;
    appliesTo.PublicView = this.jobDescription.PublicView;

    this.jobDescriptionAppliesToModalComponent.open(this.jobDescription.JobDescriptionId, this.jobDescription.CompanyJobId, appliesTo);
  }

  handleExportAsPDFClicked(): void {
    const viewName = this.jobDescription?.JobDescriptionStatus === JobDescriptionConstants.PUBLISHED ? this.viewName
      : JobDescriptionViewConstants.DRAFT_AND_IN_REVIEW_VIEW;
    this.exportData = { Type: 'pdf', Name: viewName };
    this.handleExport();
  }

  handleExportClickedFromActions(data: { exportType: string, viewName: string }): void {
    this.exportData = { Type: data.exportType, Name: data.viewName };
    if (this.jobDescription?.JobDescriptionStatus !== JobDescriptionConstants.PUBLISHED) {
      this.exportJobDescriptionModalComponent.open(data.exportType);
    } else {
      this.handleExport();
    }
  }

  handleExportModalConfirmed(modalPayload: any): void {
    this.exportJobDescriptionModalComponent.close();
    const viewName = modalPayload.selectedView || JobDescriptionViewConstants.DEFAULT_VIEW;
    this.exportData = { Type: modalPayload.exportType, Name: viewName };
    this.handleExport();
  }

  handleExport() {
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.export(this.exportData.Type, this.exportData.Name);
    }
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (isConfirmed) {
      this.export(this.exportData.Type, this.exportData.Name);
    }
  }

  trackByFn(index: number, section: JobDescriptionSection) {
    return section.Id;
  }

  openEmployeeAcknowledgementModal () {
    this.employeeAcknowledgementModal.open();
  }

  handleDiscardDraftConfirmed(): void {
    this.store.dispatch(new fromJobDescriptionActions.DiscardDraft({
      jobDescriptionId: this.jobDescription.JobDescriptionId,
      inWorkflow: this.identityInWorkflow
    }));
    this.showLibrary = false;
    this.showRoutingHistory = false;
  }

  handleViewSelected(viewName: string): void {
    this.viewName = viewName;
  }

  handleResize(): void {
    this.jobDescriptionIsFullscreen = !this.jobDescriptionIsFullscreen;
  }

  public get exportAction(): string {
    if (!!this.jobDescription && !!this.identity) {
      const queryStringParamName = this.isInSystemWorkflow ? '?jwt-workflow=' : '?jwt=';
      const actionQueryString = this.tokenId != null ? queryStringParamName + this.tokenId : '';
      return `/odata/JobDescription(${this.jobDescription.JobDescriptionId})/Default.Export${actionQueryString}`;
    }
  }

  private export(exportType: string, viewName: string): void {
    const htmlDocument: any = document;

    htmlDocument.exportForm.elements['export-uid'].value = Date.now();
    htmlDocument.exportForm.elements['export-type'].value = exportType;
    htmlDocument.exportForm.elements['viewName'].value = viewName;

    htmlDocument.exportForm.submit();
  }

  private initializeLibrary(): void {
    this.store.dispatch(new fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResultsByBucket({
      BucketKey: '',
      JobDescriptionId: this.jobDescription.JobDescriptionId,
      JobTitle: this.jobDescription.Name,
      Keyword: '',
      PageNumber: 1,
      PageSize: 10,
      Sources: '',
      SourceSortDirection: SortDirection.Ascending
    }));
  }

  private getJobDescriptionDetails(viewName: string = null) {
    this.store.dispatch(new fromJobDescriptionActions.GetJobDescription({
      JobDescriptionId: this.jobDescriptionId,
      ViewName:  viewName ? viewName : this.viewName,
      RevisionNumber: !!this.identity.EmployeeAcknowledgementInfo ? this.identity.EmployeeAcknowledgementInfo.Version : this.revisionNumber,
      InHistory: !!this.revisionNumber,
      InWorkflow: this.identityInWorkflow
    }));
  }

  private setWorkflowStepIsBeingViewed() {
    this.initSignalRConnection(); // sets isBeingViewed to false on signalR disconnect
    this.store.dispatch(new fromJobDescriptionActions.SetWorkflowUserStepToIsBeingViewed({jwt: this.tokenId, isBeingViewed: true}));
  }

  private initRouterParams(): void {
    const urlParams = combineLatest(
      this.route.params,
      this.route.queryParams,
      (params, queryParams) => ({ ...params, queryParams: queryParams })
    );
    this.routerParamsSubscription = urlParams.subscribe(params => {
      this.jobDescriptionId = params['id'];
      this.viewName = params.queryParams['viewName'];
      this.revisionNumber = params['versionNumber'];
      this.tokenId = !!params.queryParams['jwt'] ? params.queryParams[ 'jwt' ] :  params.queryParams[ 'jwt-workflow' ];
      this.isInSystemWorkflow = !!params.queryParams[ 'jwt-workflow' ];
      this.ssoTokenId = params.queryParams['tokenid'];
      this.ssoAgentId = params.queryParams['agentid'];

      this.inHistory = !!this.revisionNumber;

      this.initSubscriptions();
      this.loadControlTypes();
    });
  }

  private initSubscriptions(): void {
    this.jobDescriptionExtendedInfoSubscription = this.jobDescriptionExtendedInfo$.subscribe(jdei => {
      if (!!jdei && jdei.WorkflowId === 0) {
        this.showRoutingHistory = false;
      }
    });

    this.completedStepSubscription = this.completedStep$.subscribe(cs => this.completedStep = cs);

    this.identitySubscription = this.identity$.subscribe(userContext => {
      if (!!userContext) {
        this.identity = userContext;
        this.companyName = userContext.CompanyName;
        this.emailAddress = userContext.EmailAddress;
        this.identityInEmployeeAcknowledgement = userContext.EmployeeAcknowledgementInfo
          ? !!userContext.EmployeeAcknowledgementInfo.EmployeeAcknowledgementId
          : false;
        if (this.identityInEmployeeAcknowledgement) {
          if (!userContext.EmployeeAcknowledgementInfo.IsLatest && !userContext.EmployeeAcknowledgementInfo.HasAcknowledged) {
            this.router.navigate(['/token-expired']);
          }
        }

        this.identityInWorkflow = (!!userContext.WorkflowStepInfo && !!userContext.WorkflowStepInfo.WorkflowId) || this.isInSystemWorkflow;

        if (this.isInSystemWorkflow) {
          this.workflowStepInfoSubscription = this.workflowStepInfo$.subscribe(workflowStepInfo => {
            if (!!workflowStepInfo) {

              if (userContext.UserId !== workflowStepInfo.UserId) {
                this.router.navigate(['../forbidden']);
              }

              this.hasCanEditJobDescriptionPermission = workflowStepInfo.Permissions.indexOf(Permissions.CAN_EDIT_JOB_DESCRIPTION) > -1;
            }
          });
        } else {
          this.hasCanEditJobDescriptionPermission = this.permissionService.CheckPermission([Permissions.CAN_EDIT_JOB_DESCRIPTION],
            PermissionCheckEnum.Single);
        }

        this.companySubscription = this.company$.subscribe((company) => {
          this.companyLogoPath = company
            ? userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/' + company.CompanyLogo
            : '';
          if (company) {
            this.companyName = company.CompanyName;
          }
        });
        this.isSiteAdmin = userContext.AccessLevel === 'Admin';

        if (!this.completedStep) {
          this.sharedStore.dispatch(new fromCompanyLogoActions.LoadCompanyLogo(userContext.CompanyId));
        }

        this.initSsoSubscriptions();

        if (this.identityInWorkflow) {
          this.setWorkflowStepIsBeingViewed();
        }
        if (this.identityInEmployeeAcknowledgement) {
          this.store.dispatch(new fromEmployeeAcknowledgementActions.LoadEmployeeAcknowledgementInfo());
        }
        if (!this.isInSystemWorkflow && this.identity?.UserId > 0) {
          this.store.dispatch(new fromJobDescriptionActions.LoadingPage(false));
        } else {
          this.store.dispatch(new fromWorkflowActions.GetWorkflowStepInfoFromToken({ token: this.tokenId }));
        }
      }
    });

    this.jobDescriptionSubscription = this.jobDescriptionAsync$.subscribe(result => this.handleJobDescriptionChanged(result.obj));

    this.userAssignedRolesSubscription = this.userAssignedRoles$.subscribe( userRoles => {
      if (userRoles) {
        this.isCompanyAdmin = userRoles.some( x => x.RoleName === 'Company Admin' && x.Assigned);
      }
    });

    this.enableFileDownloadSecurityWarningSub = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      if (isEnabled) {
        this.enableFileDownloadSecurityWarning = true;
      }
    });

    this.controlTypesSubscription = this.controlTypesAsync$.subscribe(value => {
      if (value?.obj?.length > 0) {
        this.controlTypes = value.obj;
        this.getJobDescriptionDetails();
      }
    });

    this.jobDescriptionManagementDndService.initJobDescriptionManagementDnD(JobDescriptionManagementDndSource.JobDescription,
      (control, oldIndex, newIndex) => {
        this.store.dispatch(new fromJobDescriptionActions.ReorderControlData({
          jobDescriptionControl: control,
          oldIndex: oldIndex,
          newIndex: newIndex
        }));
        this.saveThrottle.next(true);
      });

    this.jobDescriptionDnDService.initJobDescriptionPageDnD((jobDescriptionLibraryDrop: JobDescriptionLibraryDropModel) => {
        this.store.dispatch(new fromJobDescriptionActions.AddSourceDataToControl({ controlTypes: this.controlTypes, dropModel: jobDescriptionLibraryDrop }));
        this.saveThrottle.next(true);
      }
    );

    this.jobDescriptionViewsAsyncSubscription = this.jobDescriptionViewsAsync$.subscribe(asyncObj => this.jobDescriptionViews = asyncObj.obj);
    this.editingSubscription = this.editingJobDescription$.subscribe(value => {
      if (value === true) {
        this.getJobDescriptionDetails(JobDescriptionViewConstants.DRAFT_AND_IN_REVIEW_VIEW);
      }
    });

    this.publishingSuccessSubscription = this.jobDescriptionPublishingSuccess$.subscribe(asyncObj => {
      if (asyncObj) {
        this.getJobDescriptionDetails();
      }
    });
    this.workflowStepCompletionModalSubscription = this.inSystemWorkflowStepCompletionModalOpen$.subscribe(value => {
      if (value) {
        this.workflowStepCompletionModal?.open();
      }
    });
  }

  private loadControlTypes(): void {
    if (this.inHistory) {
      this.sharedStore.dispatch(new fromControlTypesActions.LoadHistoricalControlTypes());
    } else {
      this.sharedStore.dispatch(new fromControlTypesActions.LoadControlTypes());
    }
  }

  private initSsoSubscriptions() {
    this.requireSSOLoginSubscription = this.requireSSOLogin$.subscribe(requireSSOLoginResult => {
    if (requireSSOLoginResult && this.tokenId != null && (this.identityInWorkflow || this.identity.IsPublic)) {
        this.store.dispatch(new fromHeaderActions.GetSsoHeaderDropdownNavigationLinks());
      }
    });
  }

  private initSaveThrottle() {
    // should trigger every time saving is completed
    this.savingJobDescriptionSubscription = this.savingJobDescription$.subscribe(value => {
      this.saving = value;
      if (!value) {
        // if a save has been queued due to a save call already processing, retrigger save and end queue
        if (this.queueSave) {
          this.queueSave = false;
          this.saveThrottle.next(true);
        }
      }
    });

    const saveThrottle$ = this.saveThrottle
      .pipe(
        debounceTime(100),
        tap(() => this.togglePublishButton(false)),
        debounceTime(400));

    this.saveThrottleSubscription = saveThrottle$.subscribe(save => {
      if (!this.saving) {
        this.saveJobDescription();
      } else {
        this.queueSave = true;
      }
    });

    this.discardingDraftJobDescriptionSuccessSubscription = this.discardingDraftJobDescriptionSuccess$.subscribe(value => {
      if (value) {
        this.getJobDescriptionDetails();
      }
    });
  }

  private getDataRowsForReplaceControlData(attributes: ControlTypeAttribute[], bulkDataChangeObj: any): any {
    const sourcedAttribute = attributes.find(a => a.CanBeSourced);

    return bulkDataChangeObj.dataVals.map((d, index) => {
      const currentDataRow = cloneDeep(bulkDataChangeObj.currentData.filter(cd => !cd.TemplateId)[index]);
      let dataRow;

      if (currentDataRow) {
        currentDataRow[sourcedAttribute.Name] = d;
        dataRow = currentDataRow;
      } else {
        dataRow = this.jobDescriptionManagementService.createDataRow(attributes, d);
        dataRow.Id += index;
      }

      return dataRow;
    });
  }

  private togglePublishButton(enabled: boolean): void {
    this.store.dispatch(new fromJobDescriptionActions.TogglePublishButton({ enabled }));
  }

  private defineDiscardDraftModalOptions() {
    this.discardDraftModalOptions = {
      Title: 'Discard Draft',
      Body: !this.identityInWorkflow
        ? `You have indicated you do not want this Draft any longer. By clicking Discard, all non-published content will be removed
        . In some instances, this could result in the Job Description being placed back into a Not Started status. <br/><br/> Would you like to continue?`
        : `Clicking Discard will reset this job description back to its original state when first received
        . All edits up to this point will be lost. <br /><br /> Would you like to continue?`,
      ConfirmText: 'Discard',
      CancelText: 'No',
      IsDelete: true
    };
  }

  private handleJobDescriptionChanged(jobDescription: JobDescription): void {
    if (!jobDescription) {
      return;
    }
    this.jobDescription = cloneDeep(jobDescription);
    this.visibleSections =  jobDescription.Sections.filter(x => showSection(x));


    if (jobDescription.JobDescriptionTitle === null || jobDescription.JobDescriptionTitle.length === 0) {
      const jobTitleFieldName = jobDescription.JobInformationFields.find(infoField => infoField.FieldName === 'JobTitle');
      this.jobDescriptionDisplayName = !!jobTitleFieldName ? jobTitleFieldName.FieldValue : this.jobDescription.Name;
    } else {
      this.jobDescriptionDisplayName = jobDescription.JobDescriptionTitle;
    }
  }

  private initSignalRConnection() {

    let signalRConnectionUrl = this.identity.ConfigSettings.find(c => c.Name === 'SignalR').Value;
    const signalREnabled = this.identity.ConfigSettings.find(c => c.Name === 'SignalREnabled').Value;
    const hubRoute = '/job-description-manager';

    if (signalREnabled && !!signalRConnectionUrl) {

        signalRConnectionUrl = `${signalRConnectionUrl}${hubRoute}?token=${this.tokenId}`;

        const connection = new signalR.HubConnectionBuilder()
          .withUrl(signalRConnectionUrl)
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Error)
          .build();

        connection.start();
      }
    }
  }

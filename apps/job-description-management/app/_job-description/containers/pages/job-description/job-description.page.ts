import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { filter, first, take, takeWhile } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';
import * as cloneDeep from 'lodash.clonedeep';

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
  CompanyDto
} from 'libs/models';
import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants/permissions';
import { SimpleYesNoModalComponent } from 'libs/ui/common';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import { environment } from 'environments/environment';

import { JobDescriptionManagementDnDService, JobDescriptionManagementService } from 'libs/features/job-description-management';
import {
  JobDescriptionLibraryBucket,
  JobDescriptionLibraryResult,
  LibrarySearchRequest,
  JobDescriptionAppliesTo,
  JobDescriptionExtendedInfo
} from 'libs/features/job-description-management';
import { EmployeeAcknowledgement, JobDescriptionLibraryDropModel } from '../../../models';
import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromJobDescriptionManagementSharedReducer from 'libs/features/job-description-management/reducers';
import * as fromJobDescriptionActions from '../../../actions/job-description.actions';
import * as fromJobDescriptionLibraryActions from 'libs/features/job-description-management/actions/job-description-library.actions';
import * as fromCompanyLogoActions from 'libs/features/job-description-management/actions/company-logo.actions';
import * as fromEmployeeAcknowledgementActions from '../../../actions/employee-acknowledgement.actions';
import * as fromWorkflowActions from '../../../actions/workflow.actions';
import { JobDescriptionActionsComponent } from '../../job-description-actions';
import { JobDescriptionManagementDndSource } from 'libs/features/job-description-management/constants';
import { JobDescriptionDnDService } from '../../../services';
import { EmployeeAcknowledgementModalComponent, ExportJobDescriptionModalComponent,
  WorkflowCancelModalComponent } from '../../../components/modals';
import { FlsaQuestionnaireModalComponent } from '../../../components/modals/flsa-questionnaire';
import { JobMatchesModalComponent } from '../../job-matches-modal';
import { ChangeApproverModalComponent } from '../../change-approver-modal';
import { CopyJobDescriptionModalComponent } from '../../copy-job-description-modal';
import { JobDescriptionHelper } from '../../../helpers';
import { WorkflowSetupModalComponent } from '../../workflow-setup-modal';
import { JobDescriptionAppliesToModalComponent } from 'apps/job-description-management/app/shared';
import * as fromWorkflowTemplateListActions from 'libs/features/job-description-management/actions/shared-workflow.actions';
import * as fromHeaderActions from 'libs/ui/layout-wrapper/actions/header.actions';


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
  @ViewChild(JobDescriptionActionsComponent, { static: true }) public actionsComponent: JobDescriptionActionsComponent;
  @ViewChild(JobDescriptionAppliesToModalComponent) public jobDescriptionAppliesToModalComponent: JobDescriptionAppliesToModalComponent;
  @ViewChild(WorkflowCancelModalComponent) public workflowCancelModal: WorkflowCancelModalComponent;
  @ViewChild(WorkflowSetupModalComponent) public workflowSetupModal: WorkflowSetupModalComponent;

  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  jobDescriptionPublishing$: Observable<boolean>;
  identity$: Observable<UserContext>;
  userAssignedRoles$: Observable<UserAssignedRole[]>;
  company$: Observable<CompanyDto>;
  enablePublicViewsInClient$: Observable<boolean>;
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
  jobDescriptionSSOLoginUrl$: Observable<string>;
  jobDescriptionSSOAuthResult$: Observable<string>;
  jobDescriptionSSOAuthError$: Observable<string>;

  loadingPage$: Observable<boolean>;
  loadingPageError$: Observable<boolean>;

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
  completedStepSubscription: Subscription;
  controlTypesSubscription: Subscription;
  jobDescriptionSSOLoginUrlSubscription: Subscription;

  companyName: string;
  emailAddress: string;
  companyLogoPath: string;
  jobDescription: JobDescription;
  enableLibraryForRoutedJobDescriptions: boolean;
  hasCanEditJobDescriptionPermission: boolean;
  identityInWorkflow: boolean;
  saving: boolean;
  discardDraftModalOptions: SimpleYesNoModalOptions;
  showLibrary = false;
  showRoutingHistory = false;
  jobDescriptionIsFullscreen = false;
  isFirstSave = true;
  queueSave = false;
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
  editing: boolean;
  completedStep: boolean;
  controlTypes: ControlType[];
  requireSSOLogin = false;

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
    this.enablePublicViewsInClient$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.JDMCoreUseClient
    );

    this.requireSSOLogin$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.JDMExternalWorkflowsRequireSSOLogin
    );

    this.controlTypesAsync$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypeAndVersionAsync);
    this.hasCanEditJobDescriptionPermission = this.permissionService.CheckPermission([Permissions.CAN_EDIT_JOB_DESCRIPTION],
      PermissionCheckEnum.Single);
    this.editingJobDescription$ = this.store.select(fromJobDescriptionReducers.getEditingJobDescription);
    this.savingJobDescription$ = this.store.select(fromJobDescriptionReducers.getSavingJobDescription);
    this.jobDescriptionLibraryBuckets$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getBucketsAsync);
    this.jobDescriptionLibraryResults$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getResultsAsync);
    this.jobDescriptionExtendedInfo$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionExtendedInfo);
    this.gettingJobDescriptionExtendedInfoSuccess$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionExtendedInfoAsync);
    this.jobDescriptionPublishing$ = this.store.select(fromJobDescriptionReducers.getPublishingJobDescription);
    this.acknowledging$ = this.store.select(fromJobDescriptionReducers.getAcknowledging);
    this.employeeAcknowledgementInfo$ = this.store.select(fromJobDescriptionReducers.getEmployeeAcknowledgementAsync);
    this.employeeAcknowledgementErrorMessage$ = this.store.select(fromJobDescriptionReducers.getEmployeeAcknowledgementErrorMessage);
    this.jobDescriptionViewsAsync$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionViewsAsync);
    this.completedStep$ = this.store.select(fromJobDescriptionReducers.getCompletedStep);
    this.jobDescriptionSSOLoginUrl$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionSSOLoginUrl);
    this.jobDescriptionSSOAuthResult$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionSSOAuthResult);
    this.jobDescriptionSSOAuthError$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionSSOAuthError);
    this.saveThrottle = new Subject();

    this.loadingPage$ = this.store.select(fromJobDescriptionReducers.getLoadingPage);
    this.loadingPageError$ = this.store.select(fromJobDescriptionReducers.getLoadingPageError);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromJobDescriptionActions.LoadingPage(true));
    this.initSubscriptions();
    this.initSaveThrottle();
    this.defineDiscardDraftModalOptions();

    // we need the setting to check if we should redirect back to NG, but that call isn't made in public views, so fire an action to do that
    if (this.identity.IsPublic) {
      this.store.dispatch(new fromCompanySettingsActions.LoadCompanySettings());
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromJobDescriptionActions.ClearJobDescription());
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
  }

  appliesToFormCompleted(selected: any) {
    this.store.dispatch(new fromJobDescriptionActions.UpdateJobDescriptionAppliesToValues(selected.jobDescriptionAppliesTo));
    this.saveThrottle.next(true);
  }

  goBack(): void {
    if (!!this.identity && (this.identity.IsPublic || this.identity.WorkflowStepInfo)) {
      this.router.navigate(['/'], { queryParams: { jwt: this.tokenId } });
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
      this.store.dispatch(new fromWorkflowTemplateListActions.Load(this.jobDescription.CompanyJobId));
    }
    this.workflowSetupModal.open();
  }

  handleDiscardDraftClicked(): void {
    this.discardDraftModal.open({});
    this.isFirstSave = true;
  }

  handleEditClicked(): void {
    this.showRoutingHistory = false;

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
    this.export('pdf', 'Default');
  }

  handleExportClickedFromActions(data: { exportType: string, viewName: string }): void {
    const isUserDefinedViewsAvailable = JobDescriptionHelper.isUserDefinedViewsAvailable(this.jobDescriptionViews);
    if (this.editing && isUserDefinedViewsAvailable ) {
      this.exportJobDescriptionModalComponent.open(data.exportType);
    } else {
      this.export(data.exportType, data.viewName);
    }
  }

  handleExportModalConfirmed(modalPayload: any): void {
    const viewName = modalPayload.selectedView || 'Default';
    this.export(modalPayload.exportType, viewName);
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
    this.actionsComponent.resetViewName();
  }

  handleResize(): void {
    this.jobDescriptionIsFullscreen = !this.jobDescriptionIsFullscreen;
  }

  public get exportAction(): string {
    if (!!this.jobDescription && !!this.identity) {
      const tokenId = this.identity.UserId === 0 ? '?jwt=' + this.tokenId : '';
      return `/odata/JobDescription(${this.jobDescription.JobDescriptionId})/Default.Export${tokenId}`;
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
      PageSize: 10
    }));
  }

  private initSubscriptions(): void {
    this.jobDescriptionSSOLoginUrlSubscription = this.jobDescriptionSSOLoginUrl$.subscribe( ssoLoginUrl => {
      if (ssoLoginUrl) {
        // Redirect to SSO login. After logging in you will be redirected back here with tokenid and agentid params from the sso for use in authenticating.
        const currentURL = window.location.href;
        const currentURLWithToken = `${currentURL.slice(0, currentURL.indexOf('?'))}?jwt=${this.tokenId}`;
        const encodedUrl = encodeURIComponent(currentURLWithToken);

         window.location.href = `${ssoLoginUrl}&appurl=${encodedUrl}`;
      }
    });

    this.jobDescriptionExtendedInfoSubscription = this.jobDescriptionExtendedInfo$.subscribe(jdei => {
      if (!!jdei && jdei.WorkflowId === 0) {
        this.showRoutingHistory = false;
      }
    });

    this.completedStepSubscription = this.completedStep$.subscribe(cs => this.completedStep = cs);
    this.identitySubscription = this.identity$.subscribe(userContext => {
      this.identity = userContext;
      this.companyName = userContext.CompanyName;
      this.emailAddress = userContext.EmailAddress;
      this.identityInEmployeeAcknowledgement = userContext.EmployeeAcknowledgementInfo && !!userContext.EmployeeAcknowledgementInfo.EmployeeAcknowledgementId;
      if (this.identityInEmployeeAcknowledgement) {
        if (!userContext.EmployeeAcknowledgementInfo.IsLatest && !userContext.EmployeeAcknowledgementInfo.HasAcknowledged) {
          this.router.navigate(['/token-expired']);
        } else {
          this.store.dispatch(new fromEmployeeAcknowledgementActions.LoadEmployeeAcknowledgementInfo());
        }
      }
      this.identityInWorkflow = !!userContext.WorkflowStepInfo && !!userContext.WorkflowStepInfo.WorkflowId;
      this.companySubscription = this.company$.subscribe((company) => {
        this.companyLogoPath = company
          ? userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/' + company.CompanyLogo
          : '';
        if (company) {
          this.companyName = company.CompanyName;
        }
      });
      this.isSiteAdmin = userContext.AccessLevel === 'Admin';
      this.initRouterParams();
      if (!this.completedStep) {
        this.sharedStore.dispatch(new fromCompanyLogoActions.LoadCompanyLogo(userContext.CompanyId));
      }
    });
    this.jobDescriptionSubscription = this.jobDescriptionAsync$.subscribe(result => {
      this.handleJobDescriptionChanged(result.obj);
    });
    this.userAssignedRolesSubscription = this.userAssignedRoles$.subscribe( userRoles => {
      if (userRoles) {
        this.isCompanyAdmin = userRoles.some( x => x.RoleName === 'Company Admin' && x.Assigned);
      }
    });


    // if the setting to enable public views in this repo is disabled redirect back to the NG implementation
    this.enablePublicViewsInClient$.pipe(
      takeWhile(() => this.identity.IsPublic),
      filter(setting => setting === false)
    ).subscribe(() => window.location.href = window.location.href.replace(`/${environment.hostPath}/`, environment.ngAppRoot));


    this.requireSSOLogin$.subscribe(requireSSOLoginResult => {
      if (requireSSOLoginResult === false && this.tokenId && this.identityInWorkflow) {
          this.setWorkflowUserStepToIsBeingViewed();
      }

      if (requireSSOLoginResult  && this.tokenId != null && this.ssoTokenId == null && this.ssoAgentId == null) {

         this.store.dispatch(new fromJobDescriptionActions.GetSSOLoginUrl());

       } else if (requireSSOLoginResult && this.tokenId != null) {

         this.store.dispatch(new fromJobDescriptionActions.AuthenticateSSOParams({tokenId: this.ssoTokenId, agentId: this.ssoAgentId}));

         this.jobDescriptionSSOAuthResult$.subscribe( result => {
           if (result) {
            const resultObj: any = result;
            const userEmailDomain = this.emailAddress.slice(this.emailAddress.indexOf('@') + 1, this.emailAddress.length);

              if (resultObj.EmailDomain.indexOf(userEmailDomain) === -1 && userEmailDomain.indexOf(resultObj.EmailDomain) === -1) {
                this.router.navigate(['/forbidden']);
              }

             this.store.dispatch(new fromHeaderActions.GetSsoHeaderDropdownNavigationLinks());
             this.setWorkflowUserStepToIsBeingViewed();
             this.store.dispatch(new fromJobDescriptionActions.LoadingPage(false));
            }
         });

         this.jobDescriptionSSOAuthError$.subscribe( result => {
           if (result) {
             this.store.dispatch(new fromJobDescriptionActions.GetSSOLoginUrl());
           }
         });
       } else if (requireSSOLoginResult != null) {
          this.store.dispatch(new fromJobDescriptionActions.LoadingPage(false));
       }
    });

    this.controlTypesAsync$.pipe(
      filter(cts => !!cts && !!cts.obj),
      take(1)
    ).subscribe(ct => {
      if (!ct.obj.length) {
        this.jobDescriptionManagementService.getControlTypes();
      }
    });
    this.controlTypesSubscription = this.controlTypesAsync$.subscribe(value => this.controlTypes = value.obj);

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
    this.editingSubscription = this.editingJobDescription$.subscribe(value => this.editing = value);
  }

  private setWorkflowUserStepToIsBeingViewed() {
    this.initSignalRConnection(); // sets isBeingViewed to false on signalR disconnect
    this.store.dispatch(new fromJobDescriptionActions.SetWorkflowUserStepToIsBeingViewed({jwt: this.tokenId, isBeingViewed: true}));
  }

  private initRouterParams(): void {
    const urlParams = Observable.combineLatest(
      this.route.params,
      this.route.queryParams,
      (params, queryParams) => ({ ...params, queryParams: queryParams })
    );
    this.routerParamsSubscription = urlParams.subscribe(params => {
      const jobDescriptionId = params['id'];
      const viewName = params.queryParams['viewName'];
      const revisionNumber = params['versionNumber'];
      this.tokenId = params.queryParams['jwt'];
      this.ssoTokenId = params.queryParams['tokenid'];
      this.ssoAgentId = params.queryParams['agentid'];

      this.inHistory = !!revisionNumber;
      this.store.dispatch(new fromJobDescriptionActions.GetJobDescription({
        JobDescriptionId: jobDescriptionId,
        ViewName: viewName,
        RevisionNumber: !!this.identity.EmployeeAcknowledgementInfo ? this.identity.EmployeeAcknowledgementInfo.Version : revisionNumber,
        InHistory: !!revisionNumber,
        InWorkflow: this.identityInWorkflow
      }));
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
      .debounceTime(100)
      .do(() => this.togglePublishButton(false))
      .debounceTime(400);

    this.saveThrottleSubscription = saveThrottle$.subscribe(save => {
      if (!this.saving) {
        this.saveJobDescription();
      } else {
        this.queueSave = true;
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

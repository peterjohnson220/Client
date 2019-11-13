import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { filter, first, take } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';

import { arrayMoveMutate } from 'libs/core/functions';

import {
  JobDescription,
  UserContext,
  CompanySettingsEnum,
  AsyncStateObj,
  ControlType,
  ControlTypeAttribute,
  SimpleYesNoModalOptions,
  UserAssignedRole
} from 'libs/models';
import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants/permissions';
import { SimpleYesNoModalComponent } from 'libs/ui/common';

import { JobDescriptionManagementDnDService, JobDescriptionManagementService } from '../../../../shared/services';
import { ControlDataHelper } from '../../../../shared/helpers';
import {
  JobDescriptionLibraryBucket,
  JobDescriptionLibraryResult,
  LibrarySearchRequest,
  JobDescriptionAppliesTo
} from '../../../../shared/models';
import { EmployeeAcknowledgement, JobDescriptionExtendedInfo, ReorderControlDataDto } from '../../../models';
import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromJobDescriptionManagementSharedReducer from '../../../../shared/reducers';
import * as fromJobDescriptionActions from '../../../actions/job-description.actions';
import * as fromJobDescriptionLibraryActions from '../../../../shared/actions/job-description-library.actions';
import * as fromEmployeeAcknowledgementActions from '../../../actions/employee-acknowledgement.actions';
import * as fromWorkflowActions from '../../../actions/workflow.actions';
import { JobDescriptionActionsComponent } from '../../job-description-actions';
import { JobDescriptionManagementDndSource } from '../../../../shared/constants';
import { JobDescriptionDnDService } from '../../../services';
import { EmployeeAcknowledgementModalComponent, ExportJobDescriptionModalComponent,
  WorkflowCancelModalComponent } from '../../../components/modals';
import { FlsaQuestionnaireModalComponent } from '../../../components/modals/flsa-questionnaire';
import { JobMatchesModalComponent } from '../../job-matches-modal';
import { ChangeApproverModalComponent } from '../../change-approver-modal';
import { CopyJobDescriptionModalComponent } from '../../copy-job-description-modal';
import { JobDescriptionHelper } from '../../../helpers';

@Component({
  selector: 'pf-job-description-page',
  templateUrl: './job-description.page.html',
  styleUrls: ['./job-description.page.scss']
})
export class JobDescriptionPageComponent implements OnInit, OnDestroy {
  @ViewChild('discardDraftModal', { static: true }) public discardDraftModal: SimpleYesNoModalComponent;
  @ViewChild(JobDescriptionActionsComponent, { static: true }) public actionsComponent: JobDescriptionActionsComponent;
  @ViewChild(EmployeeAcknowledgementModalComponent, {static: true }) public employeeAcknowledgementModal: EmployeeAcknowledgementModalComponent;
  @ViewChild(FlsaQuestionnaireModalComponent, { static: true }) public flsaQuestionnaireModal: FlsaQuestionnaireModalComponent;
  @ViewChild('jobMatchesModalComponent', { static: false }) public jobMatchesModalComponent: JobMatchesModalComponent;
  @ViewChild(CopyJobDescriptionModalComponent, { static: false }) public copyJobDescriptionModal: CopyJobDescriptionModalComponent;
  @ViewChild(ExportJobDescriptionModalComponent, { static: true }) public exportJobDescriptionModalComponent: ExportJobDescriptionModalComponent;
  @ViewChild(WorkflowCancelModalComponent, { static: false }) public workflowCancelModal: WorkflowCancelModalComponent;
  // @ViewChild(WorkflowSetupModalComponent, { static: false }) public workflowSetupModal: WorkflowSetupModalComponent;
  @ViewChild(ChangeApproverModalComponent, { static: false }) public changeApproverModal: ChangeApproverModalComponent;

  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  jobDescriptionPublishing$: Observable<boolean>;
  identity$: Observable<UserContext>;
  userAssignedRoles$: Observable<UserAssignedRole[]>;
  companyLogo$: Observable<AsyncStateObj<string>>;
  enableLibraryForRoutedJobDescriptions$: Observable<boolean>;
  controlTypesAsync$: Observable<AsyncStateObj<ControlType[]>>;
  editingJobDescription$: Observable<boolean>;
  savingJobDescription$: Observable<boolean>;
  jobDescriptionLibraryBuckets$: Observable<AsyncStateObj<JobDescriptionLibraryBucket[]>>;
  jobDescriptionLibraryResults$: Observable<AsyncStateObj<JobDescriptionLibraryResult[]>>;
  jobDescriptionRevision$: Observable<number>;
  jobDescriptionExtendedInfo$: Observable<JobDescriptionExtendedInfo>;
  acknowledging$: Observable<boolean>;
  employeeAcknowledgementInfo$: Observable<AsyncStateObj<EmployeeAcknowledgement>>;
  employeeAcknowledgementErrorMessage$: Observable<string>;
  jobDescriptionViewsAsync$: Observable<AsyncStateObj<string[]>>;
  completedStep$: Observable<boolean>;


  jobDescriptionSubscription: Subscription;
  routerParamsSubscription: Subscription;
  identitySubscription: Subscription;
  revisionSubscription: Subscription;
  companyLogoSubscription: Subscription;
  enableLibraryForRoutedJobDescriptionsSubscription: Subscription;
  saveThrottleSubscription: Subscription;
  savingJobDescriptionSubscription: Subscription;
  jobDescriptionExtendedInfoSubscription: Subscription;
  userAssignedRolesSubscription: Subscription;
  saveThrottle: Subject<any>;
  jobDescriptionViewsAsyncSubscription: Subscription;
  editingSubscription: Subscription;
  completedStepSubscription: Subscription;

  companyName: string;
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
  identity: UserContext;
  identityInEmployeeAcknowledgement: boolean;
  isSiteAdmin = false;
  isCompanyAdmin = false;
  inHistory: boolean;
  jobDescriptionDisplayName: string;
  jobDescriptionViews: string[];
  editing: boolean;
  completedStep: boolean;

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
    this.companyLogo$ = this.store.select(fromJobDescriptionReducers.getCompanyLogoAsync);
    this.jobDescriptionAsync$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionAsync);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.userAssignedRoles$ = this.userContextStore.select(fromRootState.getUserAssignedRoles);
    this.enableLibraryForRoutedJobDescriptions$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.EnableLibraryForRoutedJobDescriptions
    );
    this.controlTypesAsync$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypeAndVersionAsync);
    this.hasCanEditJobDescriptionPermission = this.permissionService.CheckPermission([Permissions.CAN_EDIT_JOB_DESCRIPTION],
      PermissionCheckEnum.Single);
    this.editingJobDescription$ = this.store.select(fromJobDescriptionReducers.getEditingJobDescription);
    this.savingJobDescription$ = this.store.select(fromJobDescriptionReducers.getSavingJobDescription);
    this.jobDescriptionLibraryBuckets$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getBucketsAsync);
    this.jobDescriptionLibraryResults$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getResultsAsync);
    this.jobDescriptionExtendedInfo$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionExtendedInfo);
    this.jobDescriptionPublishing$ = this.store.select(fromJobDescriptionReducers.getPublishingJobDescription);
    this.acknowledging$ = this.store.select(fromJobDescriptionReducers.getAcknowledging);
    this.employeeAcknowledgementInfo$ = this.store.select(fromJobDescriptionReducers.getEmployeeAcknowledgementAsync);
    this.employeeAcknowledgementErrorMessage$ = this.store.select(fromJobDescriptionReducers.getEmployeeAcknowledgementErrorMessage);
    this.jobDescriptionViewsAsync$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionViewsAsync);
    this.completedStep$ = this.store.select(fromJobDescriptionReducers.getCompletedStep);
    this.saveThrottle = new Subject();
    this.defineDiscardDraftModalOptions();
  }

  ngOnInit(): void {
    this.initSubscriptions();
    this.initSaveThrottle();
  }

  ngOnDestroy(): void {
    this.routerParamsSubscription.unsubscribe();
    this.jobDescriptionSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
    this.companyLogoSubscription.unsubscribe();
    this.enableLibraryForRoutedJobDescriptionsSubscription.unsubscribe();
    this.saveThrottleSubscription.unsubscribe();
    this.savingJobDescriptionSubscription.unsubscribe();
    this.jobDescriptionExtendedInfoSubscription.unsubscribe();
    this.jobDescriptionManagementDndService.destroyJobDescriptionManagementDnD();
    this.jobDescriptionDnDService.destroyJobDescriptionPageDnD();
    this.jobDescriptionViewsAsyncSubscription.unsubscribe();
    this.editingSubscription.unsubscribe();
    this.completedStepSubscription.unsubscribe();
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
      jobDescriptionControl: bulkChangeObj,
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
      dataRow: this.jobDescriptionManagementService.createDataRow(addDataRowObj.attributes)
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
    // this.workflowSetupModal.open();
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

    // this.jobDescriptionAppliesToModalComponent.open(this.jobDescription.JobDescriptionId, this.jobDescription.CompanyJobId, appliesTo);
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
    this.jobDescriptionExtendedInfoSubscription = this.jobDescriptionExtendedInfo$.subscribe(jdei => {
      if (!!jdei && jdei.WorkflowId === 0) {
        this.showRoutingHistory = false;
      }
    });

    this.completedStepSubscription = this.completedStep$.subscribe(cs => this.completedStep = cs);
    this.jobDescriptionSubscription = this.jobDescriptionAsync$.subscribe(result => this.handleJobDescriptionChanged(result.obj));
    this.identitySubscription = this.identity$.subscribe(userContext => {
      this.identity = userContext;
      this.companyName = userContext.CompanyName;
      this.identityInEmployeeAcknowledgement = userContext.EmployeeAcknowledgementInfo && !!userContext.EmployeeAcknowledgementInfo.EmployeeAcknowledgementId;
      if (this.identityInEmployeeAcknowledgement) {
        if (!userContext.EmployeeAcknowledgementInfo.IsLatest && !userContext.EmployeeAcknowledgementInfo.HasAcknowledged) {
          this.router.navigate(['/token-expired']);
        } else {
          this.store.dispatch(new fromEmployeeAcknowledgementActions.LoadEmployeeAcknowledgementInfo());
        }
      }
      this.identityInWorkflow = !!userContext.WorkflowStepInfo && !!userContext.WorkflowStepInfo.WorkflowId;
      this.companyLogoSubscription = this.companyLogo$.subscribe((companyLogo) => {
        this.companyLogoPath = companyLogo && companyLogo.obj
          ? userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/' + companyLogo.obj
          : '';
      });
      this.isSiteAdmin = userContext.AccessLevel === 'Admin';
      this.initRouterParams();
      if (!this.completedStep) {
        this.store.dispatch(new fromJobDescriptionActions.LoadCompanyLogo(userContext.CompanyId));
      }
    });
    this.userAssignedRolesSubscription = this.userAssignedRoles$.subscribe( userRoles => {
      if (userRoles) {
        this.isCompanyAdmin = userRoles.some( x => x.RoleName === 'Company Admin' && x.Assigned);
      }
    });
    this.enableLibraryForRoutedJobDescriptionsSubscription = this.enableLibraryForRoutedJobDescriptions$.subscribe(value =>
      this.enableLibraryForRoutedJobDescriptions = value);

    this.controlTypesAsync$.pipe(
      filter(cts => !!cts && !!cts.obj),
      take(1)
    ).subscribe(ct => {
      if (!ct.obj.length) {
        this.jobDescriptionManagementService.getControlTypes();
      }
    });

    this.jobDescriptionManagementDndService.initJobDescriptionManagementDnD(JobDescriptionManagementDndSource.JobDescription,
      (control, oldIndex, newIndex) => {
        this.reorderControlData({
          jobDescriptionControl: control,
          oldIndex: oldIndex,
          newIndex: newIndex
        });
        this.saveThrottle.next(true);
      });

    this.jobDescriptionDnDService.initJobDescriptionPageDnD(
      this.jobDescription, () => this.saveThrottle.next(true)
    );

    this.jobDescriptionViewsAsyncSubscription = this.jobDescriptionViewsAsync$.subscribe(asyncObj => this.jobDescriptionViews = asyncObj.obj);
    this.editingSubscription = this.editingJobDescription$.subscribe(value => this.editing = value);
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
      const currentDataRow = bulkDataChangeObj.currentData.filter(cd => !cd.TemplateId)[index];
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

  reorderControlData(reorderControlDataDto: ReorderControlDataDto) {
    const {jobDescriptionControl, oldIndex, newIndex} = reorderControlDataDto;
    const controlData = ControlDataHelper.getControl(this.jobDescription.Sections, jobDescriptionControl).Data;

    arrayMoveMutate(controlData, oldIndex, newIndex);
    this.saveThrottle.next(true);
  }

  private handleJobDescriptionChanged(jobDescription: JobDescription): void {
    if (!jobDescription) {
      return;
    }
    this.jobDescription = jobDescription;
    if (jobDescription.JobDescriptionTitle === null || jobDescription.JobDescriptionTitle.length === 0) {
      const jobTitleFieldName = jobDescription.JobInformationFields.find(infoField => infoField.FieldName === 'JobTitle');
      this.jobDescriptionDisplayName = !!jobTitleFieldName ? jobTitleFieldName.FieldValue : this.jobDescription.Name;
    } else {
      this.jobDescriptionDisplayName = jobDescription.JobDescriptionTitle;
    }
  }
}

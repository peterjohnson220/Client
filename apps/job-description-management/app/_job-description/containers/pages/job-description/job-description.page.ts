import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';

import * as arrayMove from 'array-move';

import {
  JobDescription,
  UserContext,
  CompanySettingsEnum,
  AsyncStateObj,
  ControlType,
  JobDescriptionControl,
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
import { JobDescriptionExtendedInfo, ReorderControlDataDto } from '../../../models';
import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromJobDescriptionManagementSharedReducer from '../../../../shared/reducers';
import * as fromJobDescriptionActions from '../../../actions/job-description.actions';
import * as fromJobDescriptionLibraryActions from '../../../../shared/actions/job-description-library.actions';
import { JobDescriptionActionsComponent } from '../../job-description-actions';
import { JobDescriptionManagementDndSource } from '../../../../shared/constants';
import { JobDescriptionDnDService } from '../../../services';


@Component({
  selector: 'pf-job-description-page',
  templateUrl: './job-description.page.html',
  styleUrls: ['./job-description.page.scss']
})
export class JobDescriptionPageComponent implements OnInit, OnDestroy {
  @ViewChild('discardDraftModal', { static: true }) public discardDraftModal: SimpleYesNoModalComponent;
  @ViewChild(JobDescriptionActionsComponent, { static: true }) public actionsComponent: JobDescriptionActionsComponent;
  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  identityInEmployeeAcknowledgement$: Observable<boolean>;
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
  jobDescriptionIsFullscreen$: Observable<boolean>;

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
  isSiteAdmin = false;
  isCompanyAdmin = false;

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
    this.jobDescriptionIsFullscreen$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionIsFullscreen);
    this.jobDescriptionExtendedInfo$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionExtendedInfo);
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
  }

  goBack(): void {
    if (!!this.identity && this.identity.IsPublic) {
      this.router.navigate(['/'], { queryParams: { jwt: this.tokenId } });
    } else {
      this.router.navigate(['/']);
    }
  }

  handleControlDataChanges(changeObj: any) {
    this.updateControlData(changeObj);
    this.saveThrottle.next(true);
  }

  handleBulkControlDataChanges(bulkChangeObj: any) {
    const dataRows = this.getDataRowsForReplaceControlData(bulkChangeObj.attributes, bulkChangeObj.bulkData);
    this.replaceControlData(bulkChangeObj, dataRows);
    this.saveThrottle.next(true);
  }

  handleControlAdditionalPropertiesChangesDetected(eventArgs: any) {
    this.updateControlAdditionalProperties(eventArgs.control, eventArgs.additionalProperties);

    this.saveThrottle.next(true);
  }

  handleControlDataRowAdded(addDataRowObj: any) {
    this.addDataRowToControl(addDataRowObj.control, this.jobDescriptionManagementService.createDataRow(addDataRowObj.attributes));

    if (addDataRowObj.save) {
      this.saveThrottle.next(true);
    }
  }

  toggleLibrary() {
    this.handleShowLibrary(!this.showLibrary);
  }

  handleControlDataRowDeleted(dataRowDeletedObj: any) {
    this.removeControlDataRow(dataRowDeletedObj.jobDescriptionControl, dataRowDeletedObj.dataRowId);

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
    // this.jobMatchesModalComponent.open();
  }

  handleCancelApprovalClicked(): void {
    // this.workflowCancelModal.open();
  }

  handleCopyFromClicked(): void {
    // this.selectJobAsCopySourceModal.open();
  }

  handleFLSAClicked(): void {
    // this.flsaQuestionnaireModal.open();
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

  handleExportClicked(exportType: string): void {
    // this.exportJobDescriptionModalComponent.open(exportType);
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

  public get exportAction(): string {
    if (!!this.jobDescription && !!this.identity) {
      const tokenId = this.identity.UserId === 0 ? '?jwt=' + this.tokenId : '';
      return `/odata/JobDescription(${this.jobDescription.JobDescriptionId})/Default.Export${tokenId}`;
    }
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
    const urlParams = Observable.combineLatest(
      this.route.params,
      this.route.queryParams,
      (params, queryParams) => ({ ...params, queryParams: queryParams })
    );
    this.routerParamsSubscription = urlParams.subscribe(params => {
      const jobDescriptionId = params['id'];
      const viewName = params.queryParams['viewName'];
      this.tokenId = params.queryParams['jwt'];
      this.store.dispatch(new fromJobDescriptionActions.GetJobDescription({
        JobDescriptionId: jobDescriptionId,
        ViewName: viewName
      }));
    });

    this.jobDescriptionExtendedInfoSubscription = this.jobDescriptionExtendedInfo$.subscribe(jdei => {
      if (!!jdei && jdei.WorkflowId === 0) {
        this.showRoutingHistory = false;
      }
    });

    this.jobDescriptionSubscription = this.jobDescriptionAsync$.subscribe(result => {
      this.jobDescription = result.obj;
      if (result.obj) {
        this.store.dispatch(new fromJobDescriptionActions.GetJobDescriptionExtendedInfo(
          {jobDescriptionId: result.obj.JobDescriptionId, revision: result.obj.JobDescriptionRevision }));
      }
    });
    this.identitySubscription = this.identity$.subscribe(userContext => {
      this.identity = userContext;
      this.companyName = userContext.CompanyName;
      this.identityInWorkflow = !!userContext.WorkflowStepInfo && !!userContext.WorkflowStepInfo.WorkflowId;
      this.companyLogoSubscription = this.companyLogo$.subscribe((companyLogo) => {
        this.companyLogoPath = companyLogo && companyLogo.obj
          ? userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/' + companyLogo.obj
          : '';
      });
      this.isSiteAdmin = userContext.AccessLevel === 'Admin';
      this.store.dispatch(new fromJobDescriptionActions.LoadCompanyLogo(userContext.CompanyId));
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

  private updateControlData(changeObj: any) {
    const currentDataRow = ControlDataHelper.getJobDescriptionControlDataRow(this.jobDescription.Sections, changeObj.control, changeObj.change.dataRowId);

    currentDataRow[changeObj.change.attribute] = changeObj.change.newValue;
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

  private replaceControlData(jobDescriptionControl: JobDescriptionControl, dataRows: any) {
    const control = ControlDataHelper.getControl(this.jobDescription.Sections, jobDescriptionControl);

    const templateDataToKeep = control.Data.filter(d => d.TemplateId);
    control.Data = templateDataToKeep.concat(dataRows);
  }

  private updateControlAdditionalProperties(jobDescriptionControl: JobDescriptionControl, additionalProperties: object) {
    const control = ControlDataHelper.getControl(this.jobDescription.Sections, jobDescriptionControl);

    control.AdditionalProperties = control.AdditionalProperties || {};
    // Only set the properties we passed in so we do not overwrite any other properties that may already exist.
    for (const additionalProperty in additionalProperties) {
      if (additionalProperty.hasOwnProperty(additionalProperty)) {
        control.AdditionalProperties[additionalProperty] = additionalProperties[additionalProperty];
      }
    }
  }

  private addDataRowToControl(jobDescriptionControl: JobDescriptionControl, dataRow: any) {
    const control = ControlDataHelper.getControl(this.jobDescription.Sections, jobDescriptionControl);
    control.Data = control.Data.concat([dataRow]);
  }

  private removeControlDataRow(jobDescriptionControl: JobDescriptionControl, dataRowId: number) {
    const control = ControlDataHelper.getControl(this.jobDescription.Sections, jobDescriptionControl);
    control.Data = control.Data.filter(d => d.Id !== dataRowId);
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

    arrayMove.mutate(controlData, oldIndex, newIndex);
    this.saveThrottle.next(true);
  }
}

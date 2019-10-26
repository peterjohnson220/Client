import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { JobDescription, UserContext, CompanySettingsEnum, AsyncStateObj, ControlType, JobDescriptionControl, ControlTypeAttribute } from 'libs/models';
import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants/permissions';


import { JobDescriptionManagementService } from '../../../../shared/services';
import { ControlDataHelper } from '../../../../shared/helpers';
import { JobDescriptionLibraryBucket, JobDescriptionLibraryResult, LibrarySearchRequest } from '../../../../shared/models';
import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromJobDescriptionManagementSharedReducer from '../../../../shared/reducers';
import * as fromJobDescriptionActions from '../../../actions/job-description.actions';
import * as fromJobDescriptionLibraryActions from '../../../../shared/actions/job-description-library.actions';


@Component({
  selector: 'pf-job-description-page',
  templateUrl: './job-description.page.html',
  styleUrls: ['./job-description.page.scss']
})
export class JobDescriptionPageComponent implements OnInit, OnDestroy {
  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  identityInEmployeeAcknowledgement$: Observable<boolean>;
  jobDescriptionPublishing$: Observable<boolean>;
  identity$: Observable<UserContext>;
  companyLogo$: Observable<string>;
  enableLibraryForRoutedJobDescriptions$: Observable<boolean>;
  controlTypesAsync$: Observable<AsyncStateObj<ControlType[]>>;
  editingJobDescription$: Observable<boolean>;
  savingJobDescription$: Observable<boolean>;
  jobDescriptionLibraryBuckets$: Observable<AsyncStateObj<JobDescriptionLibraryBucket[]>>;
  jobDescriptionLibraryResults$: Observable<AsyncStateObj<JobDescriptionLibraryResult[]>>;

  jobDescriptionSubscription: Subscription;
  routerParamsSubscription: Subscription;
  identitySubscription: Subscription;
  companyLogoSubscription: Subscription;
  enableLibraryForRoutedJobDescriptionsSubscription: Subscription;
  saveThrottleSubscription: Subscription;
  savingJobDescriptionSubscription: Subscription;

  saveThrottle: Subject<any>;

  companyName: string;
  companyLogoPath: string;
  jobDescription: JobDescription;
  enableLibraryForRoutedJobDescriptions: boolean;
  hasCanEditJobDescriptionPermission: boolean;
  identityInWorkflow: boolean;
  saving: boolean;
  showLibrary = false;
  showRoutingHistory = false;
  jobDescriptionIsFullscreen = false;
  isFirstSave = true;
  queueSave = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromJobDescriptionReducers.State>,
    private userContextStore: Store<fromRootState.State>,
    private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
    private settingsService: SettingsService,
    private permissionService: PermissionService,
    private jobDescriptionManagementService: JobDescriptionManagementService
  ) {
    this.companyLogo$ = this.store.select(fromJobDescriptionReducers.getCompanyLogo);
    this.jobDescriptionAsync$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionAsync);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
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
    this.saveThrottle = new Subject();
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
    this.routerParamsSubscription = this.route.params.subscribe(params => {
      const jobDescriptionId = params['id'];
      this.store.dispatch(new fromJobDescriptionActions.GetJobDescription({ jobDescriptionId }));
    });
    this.jobDescriptionSubscription = this.jobDescriptionAsync$.subscribe(result => this.jobDescription = result.obj);
    this.identitySubscription = this.identity$.subscribe(userContext => {
      this.companyName = userContext.CompanyName;
      this.identityInWorkflow = !!userContext.WorkflowStepInfo && !!userContext.WorkflowStepInfo.WorkflowId;
      this.companyLogoSubscription = this.companyLogo$.subscribe((companyLogo) => {
        this.companyLogoPath = companyLogo
          ? userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/' + companyLogo
          : '';
      });
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
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map, take, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';

import * as fromRootState from 'libs/state/state';
import { AsyncStateObj, CompanyDto, ControlType, ControlTypeAttribute, JobDescriptionControl, UserContext } from 'libs/models';
import { JobDescription } from 'libs/models/jdm';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { SaveError } from 'libs/models/common/save-error';
import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { arrayMoveMutate } from 'libs/core/functions';
import { JobDescriptionManagementDnDService, JobDescriptionManagementService } from 'libs/features/jobs/job-description-management/services';
import { ControlDataHelper } from 'libs/features/jobs/job-description-management/helpers';
import { JobDescriptionManagementDndSource } from 'libs/features/jobs/job-description-management/constants/job-description-dnd-source';
import * as fromCompanyLogoActions from 'libs/features/jobs/job-description-management/actions/company-logo.actions';
import * as fromControlTypesActions from 'libs/features/jobs/job-description-management/actions/control-types.actions';
import * as fromJobDescriptionManagementSharedReducer from 'libs/features/jobs/job-description-management/reducers';

import * as fromJobDescriptionJobCompareActions from '../../../actions/job-description-job-compare.actions';
import * as fromJobDescriptionJobCompareReducers from '../../../reducers/index';
import * as fromJobDescriptionReducers from '../../../reducers';
import { JobCompareFullscreenSender } from '../../../constants/job-compare.constants';
import { ConflictErrorModalComponent, SaveErrorModalComponent } from '../../../../shared/components';
import { AddSourceControlDataRowDto, AppendToControlDataAttributeValueDto, ReorderControlDataDto } from '../../../models';
import { JobDescriptionDnDService } from '../../../services';

@Component({
  selector: 'pf-job-description-job-compare-page',
  templateUrl: './job-description-job-compare.page.html',
  styleUrls: ['./job-description-job-compare.page.scss']
})

export class JobDescriptionJobComparePageComponent implements OnInit, OnDestroy {
  @ViewChild('conflictErrorModal', {static: true}) public conflictErrorModal: ConflictErrorModalComponent;
  @ViewChild('saveErrorModal', {static: true}) public saveErrorModal: SaveErrorModalComponent;

  identity$: Observable<UserContext>;
  company$: Observable<CompanyDto>;
  undoChanges$: Observable<boolean>;
  replaceContents$: Observable<boolean>;

  saveThrottle: Subject<any>;
  jobDescriptionSaveError$: Observable<SaveError>;
  jobDescriptionList$: Observable<JobDescription[]>;
  sourceJobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  jobDescriptionForComparisonAsync$: Observable<AsyncStateObj<JobDescription>>;
  jobDescriptionComparisonDiffAsync$: Observable<AsyncStateObj<any>>;
  controlTypesAsync$: Observable<AsyncStateObj<ControlType[]>>;

  companySubscription: Subscription;
  jobDescriptionSaveErrorSubscription: Subscription;
  appendToControlDataAttributeValueSubscription: Subscription;
  addSourcedControlDataRowSubscription: Subscription;
  sourceJobDescriptionSubscription: Subscription;
  controlTypeSubscription: Subscription;
  routeParamSubscription: Subscription;
  identitySubscription: Subscription;

  sourceJobDescription: JobDescription;
  hasCanEditJobDescriptionPermission: boolean;
  editingJobDescription = false;
  leftJobDescriptionIsFullscreen = false;
  rightJobDescriptionIsFullscreen = false;
  companyLogoPath: string;
  jobDescriptionId: number;

  _JobCompareFullscreenSender: typeof JobCompareFullscreenSender = JobCompareFullscreenSender;
  private isFirstSave = true;

  constructor(private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
              private store: Store<fromJobDescriptionReducers.State>,
              private router: Router,
              private route: ActivatedRoute,
              private permissionService: PermissionService,
              private jobDescriptionManagementService: JobDescriptionManagementService,
              private jobDescriptionApiService: JobDescriptionApiService,
              private jobDescriptionManagementDndService: JobDescriptionManagementDnDService,
              private jobDescriptionDnDService: JobDescriptionDnDService) {
    this.jobDescriptionList$ = this.store.select(fromJobDescriptionJobCompareReducers.getJobDescriptionJobCompareJobDescriptionList);
    this.sourceJobDescriptionAsync$ = this.store.select(fromJobDescriptionJobCompareReducers.getJobDescriptionJobCompareSourceJobDescriptionAsync);
    this.jobDescriptionForComparisonAsync$ = this.store.select(fromJobDescriptionJobCompareReducers.getJobDescriptionForComparisonAsync);
    this.jobDescriptionComparisonDiffAsync$ = this.store.select(fromJobDescriptionJobCompareReducers.getJobDescriptionJobCompareComparisonDiffAsync);
    this.controlTypesAsync$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypesAsync);
    this.jobDescriptionSaveError$ = this.store.select(fromJobDescriptionJobCompareReducers.getJobDescriptionSaveError);
    this.identity$ = this.store.select(fromRootState.getUserContext);

    this.company$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getCompany);
    this.saveThrottle = new Subject();

    this.hasCanEditJobDescriptionPermission = this.permissionService.CheckPermission([Permissions.CAN_EDIT_JOB_DESCRIPTION],
      PermissionCheckEnum.Single);

    this.undoChanges$ = this.store.select(fromJobDescriptionReducers.getUndoJobDescriptionChangesComplete);
    this.replaceContents$ = this.store.select(fromJobDescriptionReducers.getReplaceJobDescriptionComplete);
  }

  ngOnInit() {
    this.initSaveThrottle();

    // Get Identity
    this.identitySubscription = this.identity$.subscribe(identity => {
      this.companySubscription = this.company$.subscribe((company) => {
        this.companyLogoPath = company
          ? identity.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/' + company.CompanyLogo
          : '';
      });

      this.sharedStore.dispatch(new fromCompanyLogoActions.LoadCompanyLogo(identity.CompanyId));

      // todo: move to job-description main page
      this.jobDescriptionManagementDndService.initJobDescriptionManagementDnD(JobDescriptionManagementDndSource.JobDescription,
        (control, oldIndex, newIndex) => {
          this.reorderControlData({
            jobDescriptionControl: control,
            oldIndex: oldIndex,
            newIndex: newIndex
          });
          this.saveThrottle.next(true);
        });

      // todo: move to job-description main page
      this.jobDescriptionDnDService.initJobDescriptionPageDnD(() => this.saveThrottle.next(true));
    });

    this.controlTypeSubscription = this.controlTypesAsync$.subscribe(ct => {
      if (ct?.obj?.length > 0) {
        this.store.dispatch(new fromJobDescriptionJobCompareActions.LoadSourceJobDescription(this.route.snapshot.params.id));
      }
    });

    this.jobDescriptionSaveErrorSubscription = this.jobDescriptionSaveError$.pipe(
      filter(e => !!e)
    ).subscribe(e => {
      if (e.IsConflict) { // conflict error
        this.conflictErrorModal.open();
      } else { // other error
        this.saveErrorModal.open();
      }
    });

    this.sourceJobDescriptionSubscription = this.sourceJobDescriptionAsync$.subscribe(jda => {
      if (!jda?.loading && !!jda?.obj) {
        this.sourceJobDescription = cloneDeep(jda.obj);
      }
    });
    this.routeParamSubscription = this.route.params.subscribe(params => {
      if (!!params) {
        this.jobDescriptionId = params['id'];
        this.store.dispatch(new fromJobDescriptionJobCompareActions.LoadJobDescriptionList(this.route.snapshot.params.id));
      }
    });
    this.sharedStore.dispatch(new fromControlTypesActions.LoadControlTypes());
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromJobDescriptionJobCompareActions.ResetJobDescriptionJobCompareState());
    if (this.appendToControlDataAttributeValueSubscription) {
      this.appendToControlDataAttributeValueSubscription.unsubscribe();
    }
    if (this.addSourcedControlDataRowSubscription) {
      this.addSourcedControlDataRowSubscription.unsubscribe();
    }
    this.jobDescriptionManagementDndService.destroyJobDescriptionManagementDnD();
    this.jobDescriptionDnDService.destroyJobDescriptionPageDnD();
    this.companySubscription.unsubscribe();
    this.sourceJobDescriptionSubscription.unsubscribe();
    this.controlTypeSubscription.unsubscribe();
    this.jobDescriptionSaveErrorSubscription.unsubscribe();
    this.routeParamSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
  }

  beginEditing() {
    this.editingJobDescription = true;
  }

  finishEditing() {
    this.editingJobDescription = false;
  }

  handleResize(sender: JobCompareFullscreenSender) {
    if (sender === JobCompareFullscreenSender.LEFT) {
      this.leftJobDescriptionIsFullscreen = !this.leftJobDescriptionIsFullscreen;
    } else if (sender === JobCompareFullscreenSender.RIGHT) {
      this.rightJobDescriptionIsFullscreen = !this.rightJobDescriptionIsFullscreen;
    }
  }

  stopComparing() {
    this.store.dispatch(new fromJobDescriptionJobCompareActions.ResetJobDescriptionJobCompareState());
    this.router.navigate([`job-descriptions/${this.jobDescriptionId}`]);
  }

  saveJobDescription() {
    this.jobDescriptionForComparisonAsync$.pipe(
      take(1),
      map(jdca => jdca.obj)
    ).subscribe(jd => {
      try {
        this.jobDescriptionApiService.save(this.sourceJobDescription, this.isFirstSave).pipe(
          filter(response => !!response),
          take(1)
        ).subscribe(response => {
          this.sourceJobDescription.DraftNumber = response.DraftNumber;
          this.sourceJobDescription.JobDescriptionStatus = response.JobDescriptionStatus;
          this.sourceJobDescription.JobDescriptionRevision = response.JobDescriptionRevision;

          if (this.isFirstSave) {
            this.sourceJobDescription.Name = response.Name;
            this.sourceJobDescription.JobInformationFields = response.JobInformationFields;
          }

          const sourceJobDescriptionId = this.sourceJobDescription.JobDescriptionId;
          if (jd) {
            this.store.dispatch(new fromJobDescriptionJobCompareActions.LoadJobDescriptionComparisonDiff(sourceJobDescriptionId, jd.JobDescriptionId));
          }
        });
      } catch (error) {
        this.store.dispatch(new fromJobDescriptionJobCompareActions.SaveJobDescriptionError(
          this.jobDescriptionManagementService.buildErrorModel(error, 'job description', 'job-description-management/job-descriptions')));
      }

      this.isFirstSave = false;
    });
  }

  handleComparisonJobChanged(jobDescriptionForComparison: JobDescription) {
    this.store.dispatch(new fromJobDescriptionJobCompareActions
      .LoadJobDescriptionForComparison(jobDescriptionForComparison.JobDescriptionId));

    this.store.dispatch(
      new fromJobDescriptionJobCompareActions.LoadJobDescriptionComparisonDiff(
        this.route.snapshot.params.id,
        jobDescriptionForComparison.JobDescriptionId));
  }

  handleControlDataChanges(changeObj: any) {
    this.updateControlData(changeObj);

    this.saveThrottle.next(true);
  }

  handleBulkControlDataChanges(bulkChangeObj: any) {
    const dataRows = this.getDataRowsForReplaceControlData(bulkChangeObj.attributes, bulkChangeObj.bulkData);
    this.replaceControlData(bulkChangeObj.control, dataRows);
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

  handleControlDataRowDeleted(dataRowDeletedObj: any) {
    this.removeControlDataRow(dataRowDeletedObj.jobDescriptionControl, dataRowDeletedObj.dataRowId);

    this.saveThrottle.next(true);
  }

  handleConflictOrSaveErrorModalClosed() {
    this.store.dispatch(new fromJobDescriptionJobCompareActions.ClearSaveJobDescriptionError());
  }

  reorderControlData(reorderControlDataDto: ReorderControlDataDto) {
    const {jobDescriptionControl, oldIndex, newIndex} = reorderControlDataDto;
    const controlData = ControlDataHelper.getControl(this.sourceJobDescription.Sections, jobDescriptionControl).Data;

    arrayMoveMutate(controlData, oldIndex, newIndex);
    this.saveThrottle.next(true);
  }

  handleAddSourcedControlDataRow(addSourceControlDataRow: AddSourceControlDataRowDto) {
    const {jobDescriptionControl, attributes, data} = addSourceControlDataRow;
    this.addDataRowToControl(jobDescriptionControl, this.jobDescriptionManagementService.createDataRow(attributes, data));
  }

  appendToControlDataAttributeValue(appendToControlDataAttributeValueDto: AppendToControlDataAttributeValueDto) {
    const {jobDescriptionControl, dataRow, attribute, value} = appendToControlDataAttributeValueDto;
    ControlDataHelper.updateControlAttribute(this.sourceJobDescription.Sections, jobDescriptionControl, dataRow.Id, attribute, value);
  }

  private initSaveThrottle() {
    const saveThrottle$ = this.saveThrottle.pipe(debounceTime(500));

    saveThrottle$.subscribe(save => {
      this.saveJobDescription();
    });
  }

  private getDataRowsForReplaceControlData(attributes: ControlTypeAttribute[], bulkDataChangeObj: any) {
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

  private updateControlData(changeObj: any) {
    const currentDataRow = ControlDataHelper.getJobDescriptionControlDataRow(this.sourceJobDescription.Sections, changeObj.control, changeObj.change.dataRowId);

    currentDataRow[changeObj.change.attribute] = changeObj.change.newValue;
  }

  private replaceControlData(jobDescriptionControl: JobDescriptionControl, dataRows: any) {
    const control = ControlDataHelper.getControl(this.sourceJobDescription.Sections, jobDescriptionControl);

    const templateDataToKeep = control.Data.filter(d => d.TemplateId);
    control.Data = templateDataToKeep.concat(dataRows);
  }

  private updateControlAdditionalProperties(jobDescriptionControl: JobDescriptionControl, additionalProperties: object) {
    const control = ControlDataHelper.getControl(this.sourceJobDescription.Sections, jobDescriptionControl);

    control.AdditionalProperties = control.AdditionalProperties || {};
    // Only set the properties we passed in so we do not overwrite any other properties that may already exist.
    for (const additionalProperty in additionalProperties) {
      if (additionalProperty.hasOwnProperty(additionalProperty)) {
        control.AdditionalProperties[additionalProperty] = additionalProperties[additionalProperty];
      }
    }
  }

  private addDataRowToControl(jobDescriptionControl: JobDescriptionControl, dataRow: any) {
    const control = ControlDataHelper.getControl(this.sourceJobDescription.Sections, jobDescriptionControl);
    control.Data = control.Data.concat([dataRow]);
  }

  private removeControlDataRow(jobDescriptionControl: JobDescriptionControl, dataRowId: number) {
    const control = ControlDataHelper.getControl(this.sourceJobDescription.Sections, jobDescriptionControl);
    control.Data = control.Data.filter(d => d.Id !== dataRowId);
  }
}

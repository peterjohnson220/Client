import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';

import { Store, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';
import cloneDeep from 'lodash/cloneDeep';

import { JobDescriptionSummaryEditorComponent } from 'libs/forms';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { JobDescriptionSummary, AsyncStateObj, JobDescriptionSection, ControlType, JobDescription, CompanySettingsEnum, showSection } from 'libs/models';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { PermissionService } from 'libs/core/services';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums';
import { ControlDataHelper } from 'libs/features/jobs/job-description-management/helpers';
import * as fromJobManagementActions from 'libs/features/jobs/job-management/actions';
import * as fromJDMSharedReducer from 'libs/features/jobs/job-description-management/reducers';
import * as fromControlTypesActions from 'libs/features/jobs/job-description-management/actions/control-types.actions';
import { SettingsService } from 'libs/state/app-context/services';
import { JobDescriptionExportRequest } from 'libs/models/payfactors-api';

import * as fromJobsPageReducer from '../../../../reducers';
import * as fromJobDescriptionActions from '../../../../actions';
import { PageViewIds } from '../../../../constants';

@Component({
  selector: 'pf-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: PfDataGridFilter[];

  @ViewChild(JobDescriptionSummaryEditorComponent, { static: false }) jobDescriptionEditor: JobDescriptionSummaryEditorComponent;

  readonly JOB_SUMMARY_MIN_LENGTH = 10;

  loading$: Observable<boolean>;
  updatedJobDescription$: Observable<string>;
  controlTypesAsync$: Observable<AsyncStateObj<ControlType[]>>;
  enableFileDownloadSecurityWarning$: Observable<boolean>;

  loadJobDescriptionSuccessSubscription: Subscription;
  controlTypesSubscription: Subscription;
  jobDescriptionSummaryAsyncObjSubscription: Subscription;
  jobDescriptionSummaryAsyncObj: AsyncStateObj<JobDescriptionSummary>;

  jobDescriptionSummary: JobDescriptionSummary;
  jobDescription: JobDescription;
  visibleSections: JobDescriptionSection[];
  jobDescriptionCreatedDate: Date;
  controlTypes: ControlType[];
  isJobDescriptionInitialized: boolean;
  pfThemeType = PfThemeType;
  hasJobDescriptionAccess: boolean;
  jobsPageViewId = PageViewIds.Jobs;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private actionsSubject: ActionsSubject,
    private sharedJDMStore: Store<fromJDMSharedReducer.State>,
    private settingsService: SettingsService,
    private permissionService: PermissionService
  ) {
    this.controlTypesAsync$ = this.sharedJDMStore.select(fromJDMSharedReducer.getControlTypesAsync);
    this.enableFileDownloadSecurityWarning$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

  ngOnInit(): void {
    this.hasJobDescriptionAccess = this.permissionService.CheckPermission([Permissions.JOB_DESCRIPTIONS],
      PermissionCheckEnum.Single);
    this.loadJobDescriptionSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobDescriptionActions.LOAD_JOB_DESCRIPTION_SUCCESS))
      .subscribe((action: fromJobDescriptionActions.LoadJobDescriptionSuccess) => {
        this.jobDescriptionSummary = cloneDeep(action.payload);
        this.isJobDescriptionInitialized = false;
        this.initJobDescription();
      });

    this.jobDescriptionSummaryAsyncObjSubscription = this.store.select(fromJobsPageReducer.getJobDescriptionSummary).subscribe((o) => {
      this.jobDescriptionSummaryAsyncObj = o;
    });

    this.controlTypesSubscription = this.controlTypesAsync$.subscribe(asyncObj => this.handleControlTypesLoaded(asyncObj));

    this.loading$ = this.store.select(fromJobsPageReducer.getLoading);
    this.updatedJobDescription$ = this.store.select(fromJobsPageReducer.getUpdatedJobDescription);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']?.currentValue) {
      this.jobDescriptionSummary = null;
      const companyJobIdFilter: PfDataGridFilter = this.filters.find(i => i.SourceName === 'CompanyJob_ID');
      if (companyJobIdFilter?.Values?.length > 0) {
        this.store.dispatch(new fromJobDescriptionActions.LoadJobDescription((<any>companyJobIdFilter.Values[0]) as number));
      }
    }
  }

  jobDescriptionChanged(newJobDescription: string) {
    this.store.dispatch(new fromJobDescriptionActions.ChangeJobDescription(newJobDescription));
  }

  ngOnDestroy() {
    this.store.dispatch(new fromJobManagementActions.ResetState());
    this.loadJobDescriptionSuccessSubscription.unsubscribe();
    this.jobDescriptionSummaryAsyncObjSubscription.unsubscribe();
    this.controlTypesSubscription.unsubscribe();
  }

  saveJobDescription() {
    this.store.dispatch(new fromJobDescriptionActions.SaveJobDescription());
  }

  isValidJobDescription(): boolean {
    return this.jobDescriptionEditor?.isValid();
  }

  trackByFn(index: number, section: JobDescriptionSection) {
    return section.Id;
  }

  handleExportJobDescription(request: JobDescriptionExportRequest): void {
    this.store.dispatch(new fromJobDescriptionActions.ExportJobDescription(request));
  }

  private initJobDescription(): void {
    this.jobDescription = this.jobDescriptionSummary.JobDescription;
    if (!!this.jobDescription) {
      this.jobDescriptionCreatedDate = new Date(this.jobDescription.CreatedDate);
      this.initJobDescriptionDataRows();
    }
  }

  private initJobDescriptionDataRows(): void {
    if (!this.hasJobDescriptionAccess) {
      return;
    }

    if (!this.controlTypes?.length) {
      this.loadControlTypes();
      return;
    }

    if (this.jobDescription?.Sections?.length > 0) {
      this.jobDescription.Sections = ControlDataHelper.initDataRows(this.jobDescription.Sections, this.controlTypes);
      this.visibleSections = this.jobDescription.Sections.filter(x => showSection(x));
      this.isJobDescriptionInitialized = true;
    }
  }

  private loadControlTypes(): void {
    this.sharedJDMStore.dispatch(new fromControlTypesActions.LoadControlTypes());
  }

  private handleControlTypesLoaded(controlTypesAsync: AsyncStateObj<ControlType[]>): void {
    if (controlTypesAsync?.obj?.length > 0) {
      this.controlTypes = controlTypesAsync.obj;
      this.initJobDescriptionDataRows();
    }
  }

}

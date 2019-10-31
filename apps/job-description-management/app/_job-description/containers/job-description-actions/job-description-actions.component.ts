import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import * as fromRootState from 'libs/state/state';
import { AsyncStateObj, JobDescription, UserContext } from 'libs/models';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants/permissions';

import * as fromJobDescriptionReducers from '../../reducers';
import * as fromJobDescriptionActions from '../../actions/job-description.actions';
import * as fromJobMatchesActions from '../../actions/job-matches.actions';
import { JobDescriptionExtendedInfo } from '../../models';
import { JobDescriptionViewConstants } from '../../../shared/constants';

@Component({
  selector: 'pf-job-description-actions',
  templateUrl: './job-description-actions.component.html',
  styleUrls: ['./job-description-actions.component.scss']
})
export class JobDescriptionActionsComponent implements OnInit, OnDestroy {
  @Output() undoClicked = new EventEmitter();
  @Output() publishClicked = new EventEmitter();
  @Output() routeForApprovalClicked = new EventEmitter();
  @Output() discardDraftClicked = new EventEmitter();
  @Output() editClicked = new EventEmitter();
  @Output() priceJobClicked = new EventEmitter();
  @Output() cancelApprovalClicked = new EventEmitter();
  @Output() copyFromClicked = new EventEmitter();
  @Output() flsaClicked = new EventEmitter();
  @Output() libraryClicked = new EventEmitter();
  @Output() routingHistoryClicked = new EventEmitter();
  @Output() updateJobInfoClicked = new EventEmitter();
  @Output() exportClicked: EventEmitter<string> = new EventEmitter<string>();

  identity$: Observable<UserContext>;
  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  jobDescriptionChangeHistory$: Observable<JobDescription[]>;
  savingJobDescription$: Observable<boolean>;
  publishingJobDescription$: Observable<boolean>;
  publishButtonEnabled$: Observable<boolean>;
  editingJobDescription$: Observable<boolean>;
  inHistory$: Observable<boolean>;
  jobDescriptionExtendedInfo$: Observable<JobDescriptionExtendedInfo>;
  editing$: Observable<boolean>;
  jobDescriptionViewsAsync$: Observable<AsyncStateObj<string[]>>;

  identitySubscription: Subscription;
  jobDescriptionSubscription: Subscription;
  jobDescriptionChangeHistorySubscription: Subscription;
  jobDescriptionExtendedInfoSubscription: Subscription;
  editingSubscription: Subscription;
  jobDescriptionViewsAsyncSubscription: Subscription;
  inHistorySubscription: Subscription;

  jobDescription: JobDescription;
  jobDescriptionExtendedInfo: JobDescriptionExtendedInfo;
  jobDescriptionViews: string[];
  identity: UserContext;
  inWorkflow: boolean;
  undoQueueAvailable: boolean;
  containsFLSA: boolean;
  editing: boolean;
  inHistory: boolean;
  hasCanPublishJobDescriptionPermission: boolean;
  hasCanRouteJobDescriptionPermission: boolean;
  hasCanEditJobDescriptionPermission: boolean;
  hasNewProjectPermission: boolean;
  hasCanCancelWorkflowPermission: boolean;
  viewName = 'Default';

  constructor(
    private store: Store<fromJobDescriptionReducers.State>,
    private userContextStore: Store<fromRootState.State>,
    private permissionService: PermissionService,
    private router: Router
  ) {
    this.jobDescriptionAsync$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionAsync);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.jobDescriptionChangeHistory$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionChangeHistory);
    this.savingJobDescription$ = this.store.select(fromJobDescriptionReducers.getSavingJobDescription);
    this.publishingJobDescription$ = this.store.select(fromJobDescriptionReducers.getPublishingJobDescription);
    this.publishButtonEnabled$ = this.store.select(fromJobDescriptionReducers.getPublishButtonEnabled);
    this.editingJobDescription$ = this.store.select(fromJobDescriptionReducers.getEditingJobDescription);
    this.inHistory$ = this.store.select(fromJobDescriptionReducers.getInHistory);
    this.jobDescriptionExtendedInfo$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionExtendedInfo);
    this.editing$ = this.store.select(fromJobDescriptionReducers.getEditingJobDescription);
    this.jobDescriptionViewsAsync$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionViewsAsync);

    this.initPermissions();
  }

  ngOnInit(): void {
    this.identitySubscription = this.identity$.subscribe(userContext => {
      this.identity = userContext;
      this.inWorkflow = !!userContext.WorkflowStepInfo && !!userContext.WorkflowStepInfo.WorkflowId;
    });
    this.jobDescriptionSubscription = this.jobDescriptionAsync$.subscribe(asyncStateObj => {
      if (!!asyncStateObj && !!asyncStateObj.obj) {
        this.jobDescription = asyncStateObj.obj;
        this.containsFLSA = this.jobDescription.JobInformationFields.some(f => f.FieldName === 'FLSAStatus');
      }
    });
    this.jobDescriptionChangeHistorySubscription = this.jobDescriptionChangeHistory$.subscribe(results => {
      this.undoQueueAvailable = !!results && results.length > 0;
    });
    this.jobDescriptionExtendedInfoSubscription = this.jobDescriptionExtendedInfo$.subscribe(result => this.jobDescriptionExtendedInfo = result);
    this.editingSubscription = this.editing$.subscribe(value => this.editing = value);
    this.jobDescriptionViewsAsyncSubscription = this.jobDescriptionViewsAsync$.subscribe(asyncObj => {
      if (!!asyncObj) {
        this.jobDescriptionViews = asyncObj.obj;
      }
    });
    this.inHistorySubscription = this.inHistory$.subscribe(value => this.inHistory = value);
  }

  ngOnDestroy(): void {
    this.identitySubscription.unsubscribe();
    this.jobDescriptionSubscription.unsubscribe();
    this.jobDescriptionChangeHistorySubscription.unsubscribe();
    this.jobDescriptionExtendedInfoSubscription.unsubscribe();
    this.editingSubscription.unsubscribe();
    this.jobDescriptionViewsAsyncSubscription.unsubscribe();
    this.inHistorySubscription.unsubscribe();
  }

  public get hasRoutingHistory(): boolean {
    return !!this.jobDescriptionExtendedInfo && this.jobDescriptionExtendedInfo.WorkflowId > 0;
  }

  resetViewName(): void {
    this.viewName = 'Default';
  }

  handleViewChanged(viewName: string): void {
    this.viewName = viewName || 'Default';

    if (this.inHistory) {
      this.store.dispatch(new fromJobDescriptionActions.GetJobDescription({
        JobDescriptionId: this.jobDescription.JobDescriptionId,
        RevisionNumber: this.jobDescription.JobDescriptionRevision,
        ViewName: this.viewName,
        InHistory: true
      }));
    } else {
      this.store.dispatch(new fromJobDescriptionActions.GetJobDescription({
        JobDescriptionId: this.jobDescription.JobDescriptionId,
        ViewName: this.viewName,
        InWorkflow: this.inWorkflow,
        InHistory: false
      }));
    }
  }

  handleUndoClicked(): void {
    this.store.dispatch(new fromJobDescriptionActions.UndoJobDescriptionChanges());
    this.undoClicked.emit();
  }

  handlePublishClicked(): void {
    this.store.dispatch(new fromJobDescriptionActions.PublishJobDescription({ jobDescriptionId: this.jobDescription.JobDescriptionId }));
    this.publishClicked.emit();
  }

  handleRouteForApprovalClicked(): void {
    this.routeForApprovalClicked.emit();
  }

  handleDiscardDraftClicked(): void {
    this.discardDraftClicked.emit();
  }

  handleEditClicked(): void {
    this.store.dispatch(new fromJobDescriptionActions.EditJobDescription());
    this.editClicked.emit();
  }

  handlePriceJobClicked(): void {
    this.store.dispatch(new fromJobMatchesActions.GetJobMatches({ jobDescriptionId: this.jobDescription.JobDescriptionId }));
    this.priceJobClicked.emit();
  }

  handleCancelApprovalClicked(): void {
    this.cancelApprovalClicked.emit();
  }

  handleCompareJobsClicked(): void {
    this.router.navigate(
      [`job-descriptions/compare-jobs/${this.jobDescription.JobDescriptionId}`],
      { queryParamsHandling: 'preserve' }
    );
  }

  handleCompareVersionsClicked(): void {
    if (this.inWorkflow) {
      this.router.navigate(
        [`job-descriptions/workflow/compare-versions/${this.jobDescription.JobDescriptionId}`],
        { queryParamsHandling: 'preserve' }
      );
    } else {
      this.router.navigate(
        [
          `job-descriptions/compare-versions/${this.jobDescription.JobDescriptionId}`,
          {
            sourceVersion: this.jobDescription.JobDescriptionRevision,
            compareVersion: this.jobDescription.JobDescriptionRevision - 1
          }
        ]
      );
  }
  }

  handleCopyFromClicked(): void {
    this.copyFromClicked.emit();
  }

  handleFLSAClicked(): void {
    this.flsaClicked.emit();
  }

  handleLibraryClicked(): void {
    this.libraryClicked.emit();
  }

  handleRoutingHistoryClicked(): void {
    this.routingHistoryClicked.emit();
  }

  handleUpdateJobInfoClicked(): void {
    this.updateJobInfoClicked.emit();
  }

  handleExportAsWordClicked(): void {
    this.handleExportClicked('docx');
  }

  handleExportAsPDFClicked(): void {
    this.handleExportClicked('pdf');
  }

  private initPermissions(): void {
    this.hasCanPublishJobDescriptionPermission = this.permissionService.CheckPermission([Permissions.CAN_PUBLISH_JOB_DESCRIPTION],
      PermissionCheckEnum.Single);
    this.hasCanRouteJobDescriptionPermission = this.permissionService.CheckPermission([Permissions.CAN_ROUTE_JOB_DESCRIPTION_FOR_APPROVAL],
      PermissionCheckEnum.Single);
    this.hasCanEditJobDescriptionPermission = this.permissionService.CheckPermission([Permissions.CAN_EDIT_JOB_DESCRIPTION],
      PermissionCheckEnum.Single);
    this.hasNewProjectPermission = this.permissionService.CheckPermission([Permissions.PRICING_PROJECTS_NEW_PROJECT],
      PermissionCheckEnum.Single);
    this.hasCanCancelWorkflowPermission = this.permissionService.CheckPermission([Permissions.CAN_CANCEL_JOB_DESCRIPTION_WORKFLOW],
      PermissionCheckEnum.Single);
  }

  private handleExportClicked(exportType: string) {
    if (this.editing && this.isUserDefinedViewsAvailable() ) {
      this.exportClicked.emit(exportType);
      this.viewName = 'Default';
    } else {
      this.export(exportType);
    }
  }

  private export(exportType: string): void {
    const htmlDocument: any = document;

    htmlDocument.exportForm.elements['export-uid'].value = Date.now();
    htmlDocument.exportForm.elements['export-type'].value = exportType;
    htmlDocument.exportForm.elements['viewName'].value = this.viewName;

    htmlDocument.exportForm.submit();
  }

  private isUserDefinedViewsAvailable() {
    return this.jobDescriptionViews.length > JobDescriptionViewConstants.SYSTEM_VIEWS.length - 1;
  }
}

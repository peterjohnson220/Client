import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { copyTextToClipboard } from 'libs/core/functions';
import { JobDescription } from 'libs/models/jdm';

import * as fromWorkflowReducer from '../../../reducers';
import { JobDescriptionManagementJobDescriptionState } from '../../../reducers';
import * as fromWorkflowActions from '../../../actions/workflow.actions';
import { WorkflowLogEntry, WorkflowStepSummaryItem } from '../../../models';

@Component({
  selector: 'pf-workflow-watch-sidebar',
  templateUrl: './workflow-watch-sidebar.component.html',
  styleUrls: ['./workflow-watch-sidebar.component.scss']
})
export class WorkflowWatchSidebarComponent implements OnChanges, OnInit, OnDestroy {
  @Input() workflowId: number;
  @Input() jobDescription: JobDescription;
  @Input() showSubway: true;
  @Input() isSiteAdmin: boolean;
  @Input() isCompanyAdmin: boolean;
  @Output() changeApproverClicked = new EventEmitter();
  @Output() copyWorkflowLinkClicked = new EventEmitter();
  @Output() closed = new EventEmitter();

  workflowLogEntriesAsync$: Observable<AsyncStateObj<WorkflowLogEntry[]>>;
  workflowLogLoading$: Observable<boolean>;
  workflowStepSummary$: Observable<AsyncStateObj<WorkflowStepSummaryItem[]>>;
  workflowStepSummaryLoading$: Observable<boolean>;
  workflowLink$: Observable<string>;

  workflowLinkSub: Subscription;

  workflowLink: string;

  constructor(
    private store: Store<JobDescriptionManagementJobDescriptionState>,
  ) {
    this.workflowLogEntriesAsync$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowLogEntries));
    this.workflowLogLoading$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowLogLoading));
    this.workflowStepSummary$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowStepSummaryAsync));
    this.workflowStepSummaryLoading$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowStepSummaryAsyncLoading));
    this.workflowLink$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowLink));
  }

  close() {
    this.closed.emit(true);
  }

  copyWorkflowLink() {
    copyTextToClipboard(this.workflowLink);
  }

  ngOnInit() {
    this.workflowLinkSub = this.workflowLink$.subscribe(w => this.workflowLink = w);
  }

  ngOnChanges(changes: any) {
    if (changes.workflowId && changes.workflowId.currentValue !== changes.workflowId.previousValue) {
      this.store.dispatch(new fromWorkflowActions.GetWorkflowLink({workflowId: this.workflowId}));
      this.store.dispatch(new fromWorkflowActions.LoadWorkflowStepSummary({workflowId: this.workflowId}));
      this.store.dispatch(new fromWorkflowActions.LoadWorkflowLogEntries(
        {jobDescriptionId: this.jobDescription.JobDescriptionId, jobDescriptionRevision: this.jobDescription.JobDescriptionRevision}));
    }
  }

  ngOnDestroy(): void {
    this.workflowLinkSub.unsubscribe();
  }
}

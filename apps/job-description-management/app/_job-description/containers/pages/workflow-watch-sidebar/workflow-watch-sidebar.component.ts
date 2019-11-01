import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { JobDescription } from 'libs/models/jdm';

import { WorkflowLogEntry, WorkflowStepSummaryItem } from '../../../models';

import * as fromWorkflowReducer from '../../../reducers';
import * as fromWorkflowActions from '../../../actions/workflow.actions';

@Component({
  selector: 'pf-workflow-watch-sidebar',
  templateUrl: './workflow-watch-sidebar.component.html',
  styleUrls: ['./workflow-watch-sidebar.component.scss']
})
export class WorkflowWatchSidebarComponent implements OnChanges, OnInit {
  @Input() workflowId: number;
  @Input() jobDescription: JobDescription;
  @Input() showSubway: true;
  @Input() isSiteAdmin: boolean;
  @Input() isCompanyAdmin: boolean;
  // @Output() changeApproverClicked = new EventEmitter();
  // @Output() copyWorkflowLinkClicked = new EventEmitter();
  @Output() closed = new EventEmitter();

  workflowLogEntriesAsync$: Observable<AsyncStateObj<WorkflowLogEntry[]>>;
  workflowLogLoading$: Observable<boolean>;
  workflowStepSummary$: Observable<AsyncStateObj<WorkflowStepSummaryItem[]>>;
  workflowStepSummaryLoading$: Observable<boolean>;
  // workflowLink$: Observable<string>;

  // workflowLinkSub: Subscription;

  // private workflowLink: string;

  constructor(
    private workflowStore: Store<fromWorkflowReducer.State>,
    // private store: Store<JobDescriptionManagementJobDescriptionState>
    // private clipboardHelperService: ClipboardHelperService
  ) {
    this.workflowLogEntriesAsync$ = this.workflowStore.pipe(select(fromWorkflowReducer.getWorkflowLogEntries));
    this.workflowLogLoading$ = this.workflowStore.pipe(select(fromWorkflowReducer.getWorkflowLogLoading));
    this.workflowStepSummary$ = this.workflowStore.pipe(select(fromWorkflowReducer.getWorkflowStepSummaryAsync));
    this.workflowStepSummaryLoading$ = this.workflowStore.pipe(select(fromWorkflowReducer.getWorkflowStepSummaryAsyncLoading));
    // this.workflowLink$ = this.store.pipe(select(fromWorkflowActions.GetWorkflowLink));
  }

  close() {
    this.closed.emit(true);
  }

  // copyWorkflowLink() {
  //   this.clipboardHelperService.copyToClipboard(this.workflowLink);
  // }

  ngOnInit() {
    // this.workflowLinkSub = this.workflowLink$.subscribe(w => this.workflowLink = w);
  }

  ngOnChanges(changes: any) {
    if (changes.workflowId && changes.workflowId.currentValue !== changes.workflowId.previousValue) {
      this.workflowStore.dispatch(new fromWorkflowActions.GetWorkflowLink({workflowId: this.workflowId}));
      this.workflowStore.dispatch(new fromWorkflowActions.LoadWorkflowStepSummary({workflowId: this.workflowId}));
      this.workflowStore.dispatch(new fromWorkflowActions.LoadWorkflowLogEntries(
        {jobDescriptionId: this.jobDescription.JobDescriptionId, jobDescriptionRevision: this.jobDescription.JobDescriptionRevision}));
    }
  }
}

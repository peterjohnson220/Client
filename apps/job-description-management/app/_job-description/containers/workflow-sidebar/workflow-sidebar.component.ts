import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { JobDescription } from 'libs/models/jdm/index';
import { WorkflowStepInfo } from 'libs/models/security/index';
import { AsyncStateObj } from 'libs/models/state/index';

import { JobDescriptionManagementJobDescriptionState } from '../../reducers';
import * as fromWorkflowReducer from '../../reducers/index';
import * as fromWorkflowActions from '../../actions/workflow.actions';

import { WorkflowLogEntry } from '../../models';

@Component({
  selector: 'pf-workflow-sidebar',
  templateUrl: './workflow-sidebar.component.html',
  styleUrls: ['./workflow-sidebar.component.scss']
})
export class WorkflowSidebarComponent implements OnChanges {
  @Input() workflowStepInfo: WorkflowStepInfo;
  @Input() jobDescription: JobDescription;
  @Input() workflowStepCompleted: boolean;


  workflowLogEntriesAsync$: Observable<AsyncStateObj<WorkflowLogEntry[]>>;
  workflowLogLoading$: Observable<boolean>;
  workflowStepApproving$: Observable<boolean>;
  workflowStepRejecting$: Observable<boolean>;
  workflowStepCommentForm: FormGroup;
  commentFormSubmitted: boolean;

  constructor(
    private store: Store<JobDescriptionManagementJobDescriptionState>,
    private formBuilder: FormBuilder
  ) {
    this.workflowLogEntriesAsync$ = this.store.select(fromWorkflowReducer.getWorkflowLogEntries);
    this.workflowLogLoading$ = this.store.select(fromWorkflowReducer.getWorkflowLogLoading);
    this.workflowStepApproving$ = this.store.select(fromWorkflowReducer.getWorkflowStepApproving);
    this.workflowStepRejecting$ = this.store.select(fromWorkflowReducer.getWorkflowStepRejecting);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.jobDescription.currentValue !== undefined && !this.workflowStepCompleted) {
      this.store.dispatch(new fromWorkflowActions.LoadWorkflowLogEntries({
        jobDescriptionId: this.jobDescription.JobDescriptionId, jobDescriptionRevision: this.jobDescription.JobDescriptionRevision}));
    }
    this.workflowStepCommentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
  }

  approveWorkflowStep() {
    this.store.dispatch(new fromWorkflowActions.ApproveWorkflowStep({
      workflowStepInfo: this.workflowStepInfo,
      willProceed: true,
      comment: this.workflowStepCommentForm.value.comment
    }));
  }

  rejectWorkflowStep() {
    this.commentFormSubmitted = true;

    if (this.workflowStepCommentForm.valid) {
      this.store.dispatch(new fromWorkflowActions.RejectWorkflowStep({
        workflowStepInfo: this.workflowStepInfo,
        willProceed: false,
        comment: this.workflowStepCommentForm.value.comment
      }));
    }
  }
}

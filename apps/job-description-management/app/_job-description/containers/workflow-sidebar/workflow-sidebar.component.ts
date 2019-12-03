import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

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
export class WorkflowSidebarComponent implements OnInit, OnDestroy {
  @Input() workflowStepInfo: WorkflowStepInfo;
  @Input() workflowStepCompleted: boolean;


  workflowLogEntriesAsync$: Observable<AsyncStateObj<WorkflowLogEntry[]>>;
  workflowLogLoading$: Observable<boolean>;
  workflowStepApproving$: Observable<boolean>;
  workflowStepRejecting$: Observable<boolean>;
  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  workflowStepCommentForm: FormGroup;
  commentFormSubmitted: boolean;
  jobDescriptionSubscription: Subscription;

  constructor(
    private store: Store<JobDescriptionManagementJobDescriptionState>,
    private formBuilder: FormBuilder
  ) {
    this.workflowLogEntriesAsync$ = this.store.select(fromWorkflowReducer.getWorkflowLogEntries);
    this.workflowLogLoading$ = this.store.select(fromWorkflowReducer.getWorkflowLogLoading);
    this.workflowStepApproving$ = this.store.select(fromWorkflowReducer.getWorkflowStepApproving);
    this.workflowStepRejecting$ = this.store.select(fromWorkflowReducer.getWorkflowStepRejecting);
    this.jobDescriptionAsync$ = this.store.select(fromWorkflowReducer.getJobDescriptionAsync);
  }

  ngOnInit() {
    this.jobDescriptionSubscription = this.jobDescriptionAsync$
      .pipe(filter(jd => jd.obj !== null && jd.obj !== undefined),
        distinctUntilChanged((previous, current) => previous.obj.JobDescriptionId === current.obj.JobDescriptionId))
      .subscribe( jd => {
        if (jd.obj.JobDescriptionId !== null && !this.workflowStepCompleted) {
          this.store.dispatch(new fromWorkflowActions.LoadWorkflowLogEntries({
            jobDescriptionId: jd.obj.JobDescriptionId, jobDescriptionRevision: jd.obj.JobDescriptionRevision
          }));
        }
      });

    this.workflowStepCommentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.jobDescriptionSubscription.unsubscribe();
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

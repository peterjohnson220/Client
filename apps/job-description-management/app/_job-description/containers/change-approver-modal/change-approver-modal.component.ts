import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { JobDescriptionManagementJobDescriptionState } from '../../reducers';

import * as fromJobDescriptionManagementSharedReducer from 'libs/features/jobs/job-description-management/reducers';
import * as fromWorkflowActions from '../../actions/workflow.actions';
import * as fromSharedWorkflowActions from 'libs/features/jobs/job-description-management/actions/shared-workflow.actions';
import { WorkflowUser } from 'libs/features/jobs/job-description-management/models';


@Component({
  selector: 'pf-change-approver-modal',
  templateUrl: './change-approver-modal.component.html',
})
export class ChangeApproverModalComponent implements OnDestroy {
  @Input() workflowId: number;
  @Input() jobDescriptionId: number;
  @Input() jobDescriptionRevision: number;
  @ViewChild('changeApproverModal') public changeApproverModal: any;

  newUser$: Observable<WorkflowUser>;
  rerouting$: Observable<boolean>;
  newUserSubscription: Subscription;
  modalRef: NgbModalRef;
  rerouteComment: string;
  isLastWorkflowStep: boolean;
  currentStepUserName: string;
  newUser: any;

  constructor(
    private modalService: NgbModal,
    private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
    private store: Store<JobDescriptionManagementJobDescriptionState>
  ) {
    this.newUser$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getNewUser);
    this.rerouting$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getRerouting);
    this.newUserSubscription = this.newUser$.subscribe(nu => this.newUser = nu);
  }

  open(isLastStep: boolean, currentStepUserName: string) {
    this.isLastWorkflowStep = isLastStep;
    this.currentStepUserName = currentStepUserName;
    this.rerouteComment = '';
    this.modalRef = this.modalService.open(this.changeApproverModal, { backdrop: 'static' });
  }

  changeApprover() {
    this.modalRef.close();
    this.store.dispatch(new fromSharedWorkflowActions.RouteNewUser);
    this.store.dispatch(new fromSharedWorkflowActions.RoutingToNewUser({
      workflowId: this.workflowId, newWorkflowUser: this.newUser, comment: this.rerouteComment}));
    setTimeout(() => {
      this.store.dispatch(new fromWorkflowActions.LoadWorkflowStepSummary({workflowId: this.workflowId}));
      this.store.dispatch(new fromWorkflowActions.LoadWorkflowLogEntries({
        jobDescriptionId: this.jobDescriptionId, jobDescriptionRevision: this.jobDescriptionRevision
      }));
      this.store.dispatch(new fromWorkflowActions.GetWorkflowLink({workflowId: this.workflowId}));
    }, 500);
  }

  // lifecycle
  ngOnDestroy() {
    this.newUserSubscription.unsubscribe();
  }

}

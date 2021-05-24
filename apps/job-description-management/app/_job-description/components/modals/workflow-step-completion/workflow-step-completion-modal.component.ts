import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromWorkflowActions from '../../../actions/workflow.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

@Component({
  selector: 'pf-workflow-step-completed-modal',
  templateUrl: './workflow-step-completion-modal.component.html',
  styleUrls: ['./workflow-step-completion-modal.component.scss']
})
export class WorkflowStepCompletionModalComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private modalRef: NgbModalRef;

  @ViewChild('workflowStepCompletionModal', {static: true}) public workflowStepCompletionModal: any;
  @Input() jobDescriptionDisplayName: string;

  jdmInboxFeatureFlag: RealTimeFlag = { key: FeatureFlags.JdmInbox, value: false };
  workflowMessage$: Observable<string>;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private store: Store<fromJobDescriptionReducers.State>,
    private featureFlagService: AbstractFeatureFlagService) {

    this.featureFlagService.bindEnabled(this.jdmInboxFeatureFlag, this.unsubscribe$);
    this.workflowMessage$ = this.store.select(fromJobDescriptionReducers.getMessage);
  }

  open() {
    this.modalRef = this.modalService.open(this.workflowStepCompletionModal, { backdrop: 'static' });
  }

  backToJobDescriptionList() {
    this.modalRef?.close();
    this.router.navigate(['/']);
  }

  backToJobDescriptionInbox() {
    this.modalRef?.close();
    this.router.navigate(['/inbox']);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromWorkflowActions.CompleteWorkflowStep());
    this.unsubscribe$.next();
  }
}

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import * as fromJobDescriptionReducers from '../../../reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'pf-workflow-step-completed-modal',
  templateUrl: './workflow-step-completion-modal.component.html',
  styleUrls: ['./workflow-step-completion-modal.component.scss']
})
export class WorkflowStepCompletionModalComponent {
  @ViewChild('workflowStepCompletionModal', {static: true}) public workflowStepCompletionModal: any;
  private modalRef: NgbModalRef;
  workflowMessage$: Observable<string>;
  @Input() jobDescriptionDisplayName: string;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private store: Store<fromJobDescriptionReducers.State>) {
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
}

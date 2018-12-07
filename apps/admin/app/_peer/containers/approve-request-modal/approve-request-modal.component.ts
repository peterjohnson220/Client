import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';

@Component({
  selector: 'pf-approve-request-modal',
  templateUrl: './approve-request-modal.component.html',
  styleUrls: ['./approve-request-modal.component.scss']
})

export class ApproveRequestModalComponent {
  @Input() modalTitle: string;
  @Input() modalText: string;
  @Input() submittingApproval$: Observable<boolean>;
  @Input() approveRequestModalOpen$: Observable<boolean>;
  @Output() approveClicked = new EventEmitter();
  @Output() closeClicked = new EventEmitter();

  approveForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  get approvalPlaceholder(): string {
    return `Please provide a reason for approval... (optional)`;
  }

  get reason() { return this.approveForm.get('reason'); }
  get peopleToNotify() { return this.approveForm.get('peopleToNotify'); }

  createForm(): void {
    this.approveForm = this.fb.group({
      'peopleToNotify': ['', [PfValidators.required]],
      'reason': ['']
    });
  }

  handleFormSubmit() {
    this.approveClicked.emit({
      reason: this.reason.value,
      peopleToNotify: this.peopleToNotify.value
    });
  }

  handleModalDismissed() {
    this.closeClicked.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';
import { ExchangeRequestPeopleToNotifyEnum } from 'libs/models/peer';

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
  exchangeRequestPeopleToNotifyEnum = ExchangeRequestPeopleToNotifyEnum;

  constructor(
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  get approvalPlaceholder(): string {
    return `Please provide the reason for approval... (should be at least 30 characters)`;
  }

  get reason() { return this.approveForm.get('reason'); }
  get peopleToNotify() { return this.approveForm.get('peopleToNotify'); }

  createForm(): void {
    this.approveForm = this.fb.group({
      'peopleToNotify': [ExchangeRequestPeopleToNotifyEnum.NoOne, [PfValidators.required]],
      'reason': ['', [PfValidators.required, PfValidators.minLengthTrimWhitespace(30)]]
    });
  }

  setPlaceholderOnBlur(event: any) {
    event.target.placeholder = this.approvalPlaceholder;
  }

  handleFormSubmit() {
    this.approveClicked.emit({
      reason: this.reason.value,
      peopleToNotify: this.peopleToNotify.value
    });
  }

  handleModalDismissed() {
    this.closeClicked.emit();
    if (this.approveForm) {
      this.approveForm.reset();
      this.approveForm.get('peopleToNotify').setValue(ExchangeRequestPeopleToNotifyEnum.NoOne);
    }
  }
}

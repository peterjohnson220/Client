import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';

@Component({
  selector: 'pf-deny-request-modal',
  templateUrl: './deny-request-modal.component.html',
  styleUrls: ['./deny-request-modal.component.scss']
})

export class DenyRequestModalComponent {
  @Input() modalTitle: string;
  @Input() modalText: string;
  @Input() submittingDenial$: Observable<boolean>;
  @Input() denyRequestModalOpen$: Observable<boolean>;
  @Output() denyClicked = new EventEmitter();
  @Output() closeClicked = new EventEmitter();

  denyReasonForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  get denialPlaceholder(): string {
    return `Please provide a reason for denial...`;
  }

  get reason() { return this.denyReasonForm.get('reason'); }

  createForm(): void {
    this.denyReasonForm = this.fb.group({
      'reason': ['', [PfValidators.required]]
    });
  }

  handleFormSubmit() {
    this.denyClicked.emit(this.reason.value);
  }

  handleModalDismissed() {
    this.closeClicked.emit();
  }
}

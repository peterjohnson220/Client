import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { PfValidators } from 'libs/forms';

@Component({
  selector: 'pf-share-pricing-summary-modal',
  templateUrl: './share-pricing-summary-modal.component.html',
  styleUrls: ['./share-pricing-summary-modal.component.scss']
})
export class SharePricingSummaryModalComponent implements OnInit {
  @Input() isOpen$: Observable<boolean>;
  @Input() isSendingEmail: boolean;
  @Input() sharingConflict: boolean;
  @Input() sharingError: boolean;
  @Output() sendClick = new EventEmitter<{ emailAddress: string, note: string }>();
  @Output() cancelClick = new EventEmitter();

  sharePricingSummaryForm: FormGroup;
  showErrorMessages = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.sharePricingSummaryForm = this.fb.group({
      'emailAddress': ['', [PfValidators.required, Validators.email]],
      'note': ['']
    });
  }

  handleSendClicked() {
    this.showErrorMessages = true;
    this.sendClick.emit({
      emailAddress: this.sharePricingSummaryForm.value.emailAddress,
      note: this.sharePricingSummaryForm.value.note
    });
  }

  handleCancelClicked() {
    this.cancelClick.emit();
  }

}

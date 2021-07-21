import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { RangeGroupMetadata } from 'libs/models';

@Component({
  selector: 'pf-model-settings-modal',
  templateUrl: './model-settings-modal.component.html',
  styleUrls: ['./model-settings-modal.component.scss']
})
export class ModelSettingsModalComponent {
  @Input() modalId: string;
  @Input() metaData: RangeGroupMetadata;
  @Input() modalOpen$: Observable<boolean>;
  @Input() modelSettingsForm: FormGroup;
  @Input() savingModelSettingsAsyncObj$: Observable<AsyncStateObj<boolean>>;

  @Output() modalSubmit = new EventEmitter();
  @Output() modalAttemptedSubmit = new EventEmitter();
  @Output() modalDismissed = new EventEmitter();

  constructor() {}

  handleModalSubmit() {
    this.modalSubmit.emit();
  }

  handleModalSubmitAttempt() {
    this.modalAttemptedSubmit.emit();
  }

  handleModalDismiss() {
    this.modalDismissed.emit();
  }
}

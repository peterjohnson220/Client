import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-action-button',
  templateUrl: './action-button.component.html'
})
export class ActionButtonComponent {
  @Input() saveButtonText = 'Save';
  @Input() cancelButtonText = 'Cancel';
  @Input() saveButtonDisabled = false;
  @Input() cancelButtonDisabled = false;
  @Input() showCancelButton = true;
  @Input() saveButtonQaId: string;
  @Input() cancelButtonQaId: string;
  @Output() saveClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();

  constructor() {
  }

  cancelButtonClicked(): void {
    this.cancelClicked.emit();
  }

  saveButtonClicked(): void {
    this.saveClicked.emit();
  }
}

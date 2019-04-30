import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pf-unsaved-changes-warning',
  templateUrl: './unsaved-changes-warning.component.html',
  styleUrls: ['./unsaved-changes-warning.component.scss']
})
export class UnsavedChangesWarningComponent {
  @Input() isVisible: boolean;

  @Output() cancelClick = new EventEmitter();
  @Output() leaveClick = new EventEmitter();

  constructor() { }

  handleLeaveClicked() {
    this.leaveClick.emit();
  }

  handleCancelClicked() {
    this.cancelClick.emit();
  }
}

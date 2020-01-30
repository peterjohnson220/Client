import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Field } from '../../models';

@Component({
  selector: 'pf-report-field',
  templateUrl: './report-field.component.html',
  styleUrls: ['./report-field.component.scss']
})
export class ReportFieldComponent {
  @Input() field: Field;
  @Input() removable: boolean;
  @Output() fieldRemoved: EventEmitter<Field> = new EventEmitter();
  @Output() displayNameUpdated: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('inputField', {static: false}) inputField: ElementRef;

  isEditing: boolean;

  handleFieldRemoved() {
    this.fieldRemoved.emit(this.field);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    }, 0);
  }

  handleDisplayNameUpdated(event) {
    const newDisplayName = event.target.value;
    if (newDisplayName === this.field.DisplayName || newDisplayName === '') {
      this.isEditing = false;
      return;
    }

    this.displayNameUpdated.emit(newDisplayName);
    this.isEditing = false;
  }

}

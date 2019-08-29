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
  @Output() displayNameUpdated = new EventEmitter();

  @ViewChild('inputField', {static: false}) inputField: ElementRef;

  isEditing: boolean;

  constructor() {}

  handleFieldRemoved() {
    this.fieldRemoved.emit(this.field);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    }, 0);
  }

  handleDisplayNameUpdated(event, field) {
    const newDisplayName = event.target.value;
    const fieldDataElementId = field.DataElementId;
    if (newDisplayName === field.DisplayName || newDisplayName === '') {
      this.isEditing = false;
      return;
    }

    this.displayNameUpdated.emit({newDisplayName, fieldDataElementId});
    this.isEditing = false;
  }

}

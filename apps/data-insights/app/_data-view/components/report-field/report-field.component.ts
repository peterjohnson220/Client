import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Field } from 'libs/ui/formula-editor';

@Component({
  selector: 'pf-report-field',
  templateUrl: './report-field.component.html',
  styleUrls: ['./report-field.component.scss']
})
export class ReportFieldComponent {
  @Input() field: Field;
  @Input() removable: boolean;
  @Input() activeFieldsCount: number;
  @Output() fieldRemoved: EventEmitter<Field> = new EventEmitter();
  @Output() displayNameUpdated: EventEmitter<string> = new EventEmitter<string>();
  @Output() fieldIsActive: EventEmitter<{field: Field, multipleSelection: boolean}> = new EventEmitter<{field: Field, multipleSelection: boolean}>();

  @ViewChild('inputField') inputField: ElementRef;

  isEditing: boolean;
  multipleSelection: boolean;

  handleFieldRemoved() {
    this.fieldRemoved.emit(this.field);
  }

  toggledFieldSelection(event) {
    this.multipleSelection = !!event.ctrlKey;
    this.field.IsActive = !this.field.IsActive;
    this.fieldIsActive.emit({field: this.field, multipleSelection: this.multipleSelection});
  }

  toggleEdit(e: Event) {
    this.isEditing = !this.isEditing;
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    }, 0);
    e.stopPropagation();
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

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Field } from '../../models';

@Component({
  selector: 'pf-left-sidebar-existing-fields',
  templateUrl: './left-sidebar-existing-fields.component.html',
  styleUrls: ['./left-sidebar-existing-fields.component.scss']
})
export class LeftSidebarExistingFieldsComponent  {
  @Input() fields: Field[];
  @Output() fieldRemoved: EventEmitter<Field> = new EventEmitter();
  existingFieldExpanded = true;

  constructor() {}

  toggleField() {
    this.existingFieldExpanded = !this.existingFieldExpanded;
  }

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

  handleFieldRemoved(field: Field) {
    this.fieldRemoved.emit(field);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Field } from '../../models';

@Component({
  selector: 'pf-report-field',
  templateUrl: './report-field.component.html',
  styleUrls: ['./report-field.component.scss']
})
export class ReportFieldComponent  {
  @Input() field: Field;
  @Input() removable: boolean;
  @Output() fieldRemoved: EventEmitter<Field> = new EventEmitter();

  constructor() {}

  handleFieldRemoved() {
    this.fieldRemoved.emit(this.field);
  }

}

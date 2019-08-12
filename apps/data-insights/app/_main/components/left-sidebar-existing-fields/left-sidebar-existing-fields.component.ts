import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { Field } from '../../models';

@Component({
  selector: 'pf-left-sidebar-existing-fields',
  templateUrl: './left-sidebar-existing-fields.component.html',
  styleUrls: ['./left-sidebar-existing-fields.component.scss']
})
export class LeftSidebarExistingFieldsComponent  {
  @Input() fields: Field[];
  @Output() fieldRemoved: EventEmitter<Field> = new EventEmitter();
  @Output() fieldsReordered: EventEmitter<Field[]> = new EventEmitter();

  dragulaSub: Subscription;

  constructor(
    private dragulaService: DragulaService
  ) {
    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel('fields-bag').subscribe(({ sourceModel }) => {
      this.handleDropModel(sourceModel);
    }));
  }

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

  handleFieldRemoved(field: Field) {
    this.fieldRemoved.emit(field);
  }

  private handleDropModel(sourceModel) {
    if (!sourceModel) {
      return;
    }
    this.fieldsReordered.emit(sourceModel);
  }
}

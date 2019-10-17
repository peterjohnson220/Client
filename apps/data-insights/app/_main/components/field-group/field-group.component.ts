import { Component, Input, EventEmitter, Output } from '@angular/core';

import { Field } from '../../models';

@Component({
  selector: 'pf-field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.scss']
})
export class FieldGroupComponent {
  @Input() title: string;
  @Input() fields: Field[];
  @Input() removable: boolean;
  @Output() fieldSelected: EventEmitter<Field> = new EventEmitter<Field>();

  showFields = false;

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

  toggleShowFields(): void {
    this.showFields = !this.showFields;
  }

  handleFieldClicked(field: Field): void {
    this.fieldSelected.emit(field);
  }
}

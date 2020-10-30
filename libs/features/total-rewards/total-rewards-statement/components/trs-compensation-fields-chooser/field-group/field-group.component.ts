import { Component, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';

import { CompensationField, CompensationFieldGroup } from '../../../models';

@Component({
  selector: 'pf-field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.scss']
})
export class FieldGroupComponent implements OnChanges {
  @Input() group: CompensationFieldGroup;
  @Input() showFieldsOverride: boolean;
  @Output() fieldClicked: EventEmitter<CompensationField> = new EventEmitter<CompensationField>();

  showFields: boolean;

  constructor() {
    this.showFields = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.showFieldsOverride) {
      this.showFields = changes.showFieldsOverride.currentValue;
    }
  }

  trackByFn(index: any, field: CompensationField) {
    return field.Id;
  }

  toggleShowFields(): void {
    this.showFields = !this.showFields;
  }

  handleFieldClicked(field: CompensationField): void {
    this.fieldClicked.emit(field);
  }

}

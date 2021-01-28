import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';

import orderBy from 'lodash/orderBy';
import { groupBy } from '@progress/kendo-data-query';

import { Field } from 'libs/ui/formula-editor';

@Component({
  selector: 'pf-view-all-fields',
  templateUrl: './view-all-fields.component.html',
  styleUrls: ['./view-all-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAllFieldsComponent implements OnChanges {
  @Input() fields: Field[];
  @Input() removable: boolean;
  @Output() backButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() fieldAdded: EventEmitter<Field> = new EventEmitter<Field>();
  @Output() fieldRemoved: EventEmitter<Field> = new EventEmitter<Field>();

  groupedFields: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.fields && !!changes.fields.currentValue) {
      const orderedFields = orderBy(this.fields, ['DataElementOrder', (f: Field) => f.DisplayName.toLowerCase()], 'asc');
      this.groupedFields = groupBy(orderedFields, [{field: 'Entity'}]);
      this.groupedFields = orderBy(this.groupedFields, ['value', (g: any) => g.value.toLowerCase()]);
    }
  }

  trackByFn(index: any, group: any) {
    return group.Value;
  }

  handleBackButtonClicked(): void {
    this.backButtonClicked.emit();
  }

  handleFieldSelected(field: Field): void {
    if (field.IsSelected) {
      this.fieldRemoved.emit(field);
    } else {
      this.fieldAdded.emit(field);
    }
  }
}

import { Component, Input, ElementRef, ViewChild, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';

import { ViewField } from 'libs/models/payfactors-api/reports/';

import { ColumnGroup } from '../../models';

@Component({
  selector: 'pf-column-group',
  templateUrl: './column-group.component.html',
  styleUrls: ['./column-group.component.scss']
})
export class ColumnGroupComponent implements OnChanges {
  @Input() columnGroup: ColumnGroup;
  @Input() showFieldsOverride: boolean;
  @Output() fieldClicked: EventEmitter<ViewField> = new EventEmitter<ViewField>();

  @ViewChild('selectAllCheckbox', { static: true }) selectAllCheckbox: ElementRef;
  showFields: boolean;
  selectedFields: ViewField[];

  constructor() {
    this.selectedFields = [];
    this.showFields = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.columnGroup && changes.columnGroup.currentValue) {
      this.updateDisplay();
    }
    if (changes && changes.showFieldsOverride && changes.showFieldsOverride) {
      this.showFields = changes.showFieldsOverride.currentValue;
    }
  }

  trackByFn(index: any, field: ViewField) {
    return field.DataElementId;
  }

  toggleShowFields(): void {
    this.showFields = !this.showFields;
  }

  handleFieldClicked(field: ViewField): void {
    if (field.IsLocked) {
      return;
    }
    this.fieldClicked.emit(field);
    this.updateDisplay();
  }

  private updateDisplay(): void {
    this.selectedFields = this.columnGroup.FilteredFields.filter(f => f.IsSelected);
    this.updateSelectAllState();
  }

  private updateSelectAllState() {
    if (this.selectedFields.length === 0) {
      this.selectAllCheckbox.nativeElement.checked = false;
      this.selectAllCheckbox.nativeElement.indeterminate = false;
    } else if (this.selectedFields.length > 0 && this.selectedFields.length < this.columnGroup.Fields.length) {
      this.selectAllCheckbox.nativeElement.checked = false;
      this.selectAllCheckbox.nativeElement.indeterminate = true;
    } else {
      this.selectAllCheckbox.nativeElement.checked = true;
      this.selectAllCheckbox.nativeElement.indeterminate = false;
    }
  }

}

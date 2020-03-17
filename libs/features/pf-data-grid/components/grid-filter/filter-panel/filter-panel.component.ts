import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

import { ViewField, DataViewFieldDataType } from 'libs/models/payfactors-api';

import { FilterOperatorOptions, getUserFilteredFields } from '../helpers';

@Component({
  selector: 'pf-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnChanges {

  @Input() fields: ViewField[];
  @Input() filterTemplates: any;
  @Input() AllowSaveFilter: boolean;

  @Output() saveFilterClicked = new EventEmitter();
  @Output() filterChanged = new EventEmitter<ViewField>();
  @Output() filterCleared = new EventEmitter<ViewField>();
  @Output() close = new EventEmitter();

  customFilterFields: ViewField[];
  bitFields: ViewField[];
  simpleFields: ViewField[];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields']) {
      // TODO: Make this more customizable to allow different filter section configurations
      // This logic is repeated in the Filter-Builder panel and in getUserFilteredFields()
      const newFields: ViewField[] = changes['fields'].currentValue;
      this.customFilterFields = newFields.filter(f => f.CustomFilterStrategy && f.DataType !== DataViewFieldDataType.Bit);
      this.bitFields = newFields.filter(f => f.DataType === DataViewFieldDataType.Bit);
      this.simpleFields = newFields.filter(f => f.DataType !== DataViewFieldDataType.Bit && !f.CustomFilterStrategy);
    }
  }

  closeSidebar() {
    this.close.emit();
  }

  saveFilter() {
    this.saveFilterClicked.emit();
  }

  handleFilterChange(field: ViewField) {
    if (field.FilterValue || this.valueCanBeEmpty(field)) {
      this.filterChanged.emit(field);
    } else {
      this.filterCleared.emit(field);
    }
  }

  hasFilters(): boolean {
    return getUserFilteredFields(this.fields).length > 0;
  }

  trackByField(index, field: ViewField) {
    return field ? field.DataElementId : null;
  }

  private valueCanBeEmpty(field: ViewField) {
    return !FilterOperatorOptions[field.DataType].find(f => f.value === field.FilterOperator).requiresValue;
  }

}

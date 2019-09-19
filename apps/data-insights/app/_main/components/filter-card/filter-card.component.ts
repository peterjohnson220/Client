import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

import { Field, Filter, GetFilterOptionsData } from '../../models';

@Component({
  selector: 'pf-filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.scss']
})
export class FilterCardComponent {
  @Input() filterIndex: number;
  @Input() fields: Field[];
  @Input() filter: Filter;
  @Output() selectedFieldChanged: EventEmitter<Field> = new EventEmitter<Field>();
  @Output() searchOptionChanged: EventEmitter<GetFilterOptionsData> = new EventEmitter<GetFilterOptionsData>();

  @ViewChild('filterOptionsMultiSelect', {static: false}) public filterOptionsMultiSelect: MultiSelectComponent;
  terms = ['equals'];
  selectedOptions = [];
  getFilterOptionsData: GetFilterOptionsData;
  readonly MIN_QUERY_LENGTH = 2;

  public handleFilterOptionsMultiSelectOpen(event: any) {
    if (!this.getFilterOptionsData || this.getFilterOptionsData.Query.length < this.MIN_QUERY_LENGTH) {
      event.preventDefault();
    }
  }

  handleFieldChanged(field: Field): void {
    this.selectedFieldChanged.emit(field);
    this.selectedOptions = [];
  }

  handleSelectedValuesChange(values: string[]): void {
    this.selectedOptions = values;
  }

  handleFilterChange(value: string): void {
    if (!!value && value.length >= this.MIN_QUERY_LENGTH) {
      this.builGetFilterOptionsData(value);
      this.searchOptionChanged.emit(this.getFilterOptionsData);
    } else {
      this.filterOptionsMultiSelect.toggle(false);
    }
  }

  public isOptionSelected(value: string): boolean {
    return this.selectedOptions.some(option => option === value);
  }

  private builGetFilterOptionsData(query: string): void {
    this.getFilterOptionsData = {
      FilterIndex: this.filterIndex,
      EntitySourceName: this.filter.Field.EntitySourceName,
      SourceName: this.filter.Field.SourceName,
      Query: query
    };
  }
}

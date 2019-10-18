import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SelectionRange } from '@progress/kendo-angular-dateinputs';

import { DataViewFieldDataType } from 'libs/models/payfactors-api';

import { Field, Filter, FilterOperator, GetFilterOptionsData } from '../../models';

@Component({
  selector: 'pf-filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.scss']
})
export class FilterCardComponent implements OnInit {
  @Input() filterIndex: number;
  @Input() fields: Field[];
  @Input() filter: Filter;
  @Output() selectedFieldChanged: EventEmitter<Field> = new EventEmitter<Field>();
  @Output() searchOptionChanged: EventEmitter<GetFilterOptionsData> = new EventEmitter<GetFilterOptionsData>();
  @Output() selectedValuesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() deleteFilter: EventEmitter<number> = new EventEmitter<number>();
  @Output() numericValuesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() changeOperator: EventEmitter<FilterOperator> = new EventEmitter<FilterOperator>();

  getFilterOptionsData: GetFilterOptionsData;
  editMode = true;

  ngOnInit(): void {
    if (this.filter && this.filter.SelectedOptions.length > 0) {
      this.editMode = false;
    }
  }

  handleFieldChanged(field: Field): void {
    this.selectedFieldChanged.emit(field);
    this.getFilterOptionsData = null;
  }

  handleMultiSelectFilterChanged(value: string): void {
    this.builGetFilterOptionsData(value);
    this.searchOptionChanged.emit(this.getFilterOptionsData);
  }

  handleMultiSelectSelectedValuesChange(selectedOptions: string[]): void {
    this.selectedValuesChanged.emit(selectedOptions);
  }

  handleDeleteFilter(): void {
    this.deleteFilter.emit(this.filterIndex);
  }

  handleNumericValueChanged(numericValue: string[]): void {
    this.numericValuesChanged.emit(numericValue);
  }

  handleOperatorChanged(operator: FilterOperator): void {
    this.changeOperator.emit(operator);
  }

  handleDateRangeChanged(range: SelectionRange): void {
    const startDate = this.getFormattedDateString(range.start);
    const endDate = this.getFormattedDateString(range.end);
    this.selectedValuesChanged.emit([startDate, endDate]);
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  public get selectedOptionsCount(): number {
    if (this.filter.Field.DataType === DataViewFieldDataType.DateTime || this.filter.Field.DataType === DataViewFieldDataType.Float) {
      return 1;
    }
    return this.filter.SelectedOptions.length;
  }

  private builGetFilterOptionsData(query: string): void {
    this.getFilterOptionsData = {
      FilterIndex: this.filterIndex,
      EntitySourceName: this.filter.Field.EntitySourceName,
      SourceName: this.filter.Field.SourceName,
      Query: query
    };
  }

  private getFormattedDateString(date: Date): string {
    const isoDateString = date.toISOString();
    const year = isoDateString.substr(0, 4);
    const month = isoDateString.substr(5, 2);
    const day = isoDateString.substr(8, 2);
    return `${year}-${month}-${day}`;
  }
}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { SelectionRange } from '@progress/kendo-angular-dateinputs';

import { DataViewFieldDataType } from 'libs/models/payfactors-api';

import { Field, Filter, GetFilterOptionsData } from '../../models';

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
  @Output() deleteFilter: EventEmitter<Field> = new EventEmitter<Field>();

  selectedOptions = [];
  getFilterOptionsData: GetFilterOptionsData;
  editMode = true;

  ngOnInit(): void {
    if (this.filter && this.filter.SelectedOptions.length > 0) {
      this.selectedOptions = this.filter.SelectedOptions;
      this.editMode = false;
    }
  }

  handleFieldChanged(field: Field): void {
    this.selectedFieldChanged.emit(field);
    this.selectedOptions = [];
    this.getFilterOptionsData = null;
    this.selectedValuesChanged.emit(this.selectedOptions);
  }

  handleMultiSelectFilterChanged(value: string): void {
    this.builGetFilterOptionsData(value);
    this.searchOptionChanged.emit(this.getFilterOptionsData);
  }

  handleMultiSelectSelectedValuesChange(selectedOptions: string[]): void {
    this.selectedOptions = selectedOptions;
    this.selectedValuesChanged.emit(selectedOptions);
  }

  handleDeleteFilter(filter: Filter): void {
    this.deleteFilter.emit(filter.Field);
  }

  handleDateRangeChanged(range: SelectionRange): void {
    const startDate = this.getFormattedDateString(range.start);
    const endDate = this.getFormattedDateString(range.end);
    this.selectedOptions = [startDate, endDate];
    this.selectedValuesChanged.emit(this.selectedOptions);
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  public get selectedOptionsCount(): number {
    if (this.filter.Field.DataType === DataViewFieldDataType.DateTime) {
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

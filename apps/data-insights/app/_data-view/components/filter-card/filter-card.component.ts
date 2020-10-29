import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { Field, FieldDataType,
  Filter, FilterOperator, GetFilterOptionsData,
  validateFilter, getDefaultOperatorByDataType,
  getDefaultSelectedOptions, getDefaultIsValid } from 'libs/features/formula-editor';

@Component({
  selector: 'pf-filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.scss']
})
export class FilterCardComponent implements OnInit {
  @Input() filterIndex: number;
  @Input() fields: Field[];
  @Input() filter: Filter;
  @Output() filterChanged: EventEmitter<Filter> = new EventEmitter<Filter>();
  @Output() searchOptionChanged: EventEmitter<GetFilterOptionsData> = new EventEmitter<GetFilterOptionsData>();
  @Output() deleteFilter: EventEmitter<number> = new EventEmitter<number>();

  getFilterOptionsData: GetFilterOptionsData;
  editMode = true;
  fieldDataType = FieldDataType;

  ngOnInit(): void {
    if (this.filter && this.filter.SelectedOptions.length > 0) {
      this.editMode = false;
    }
  }

  handleFieldChanged(field: Field): void {
    const filterClone: Filter = cloneDeep(this.filter);
    filterClone.Field = field;
    filterClone.Operator = getDefaultOperatorByDataType(field);
    filterClone.Options = [];
    filterClone.SelectedOptions = getDefaultSelectedOptions(field.DataType);
    filterClone.IsValid = getDefaultIsValid(field.DataType);
    this.getFilterOptionsData = null;
    this.filterChanged.emit(filterClone);
  }

  handleSelectedOptionsChange(selectedOptions: string[]): void {
    const filterClone: Filter = cloneDeep(this.filter);
    filterClone.SelectedOptions = selectedOptions;
    filterClone.IsValid = validateFilter(filterClone);
    this.filterChanged.emit(filterClone);
  }

  handleOperatorChanged(operator: FilterOperator): void {
    const filterClone: Filter = cloneDeep(this.filter);
    filterClone.Operator = operator;
    filterClone.IsValid = validateFilter(filterClone);
    this.filterChanged.emit(filterClone);
  }

  handleMultiSelectFilterChanged(value: string): void {
    this.builGetFilterOptionsData(value);
    this.searchOptionChanged.emit(this.getFilterOptionsData);
  }

  handleDeleteFilter(): void {
    this.deleteFilter.emit(this.filterIndex);
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  public get selectedOptionsCount(): number {
    if (this.filter.Field.DataType === FieldDataType.Date ||
      this.filter.Field.DataType === FieldDataType.Int ||
      this.filter.Field.DataType === FieldDataType.Float) {
      return 1;
    }
    return this.filter.SelectedOptions.length;
  }

  public get isNumericDataType(): boolean {
    return !!this.filter && (
      this.filter.Field.DataType === this.fieldDataType.Int ||
      this.filter.Field.DataType === this.fieldDataType.Float
    );
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

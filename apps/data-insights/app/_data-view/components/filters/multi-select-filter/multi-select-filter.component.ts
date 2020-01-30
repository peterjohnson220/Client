import { Component, Output, Input, EventEmitter, ViewChild, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

import { FilterOperator, Equals, DoesNotEqual } from '../../../models';

@Component({
  selector: 'pf-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectFilterComponent implements OnChanges {
  @Input() selectedOperator: FilterOperator;
  @Input() options: string[];
  @Input() selectedOptions: string[];
  @Input() filterValue: string;
  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedValuesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() changeOperator: EventEmitter<FilterOperator> = new EventEmitter<FilterOperator>();

  @ViewChild('filterOptionsMultiSelect', {static: false}) public filterOptionsMultiSelect: MultiSelectComponent;
  operators = [ Equals, DoesNotEqual ];
  readonly MIN_QUERY_LENGTH = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.options && !!changes.options.currentValue &&
      !!this.filterValue && !!this.filterOptionsMultiSelect) {
      this.filterOptionsMultiSelect.toggle(true);
    }
  }

  handleFilterOptionsMultiSelectOpen(event: any) {
    if (!this.filterValue || this.filterValue.length < this.MIN_QUERY_LENGTH) {
      event.preventDefault();
    }
  }

  handleChangeOperator(value: FilterOperator) {
    this.changeOperator.emit(value);
  }

  handleFilterChange(value: string): void {
    this.filterValue = value;
    if (!!value && value.length >= this.MIN_QUERY_LENGTH) {
      this.filterChanged.emit(value);
    } else {
      this.filterOptionsMultiSelect.toggle(false);
    }
  }

  handleSelectedValuesChange(): void {
    this.selectedValuesChanged.emit(this.selectedOptions);
  }

  public isOptionSelected(value: string): boolean {
    return this.selectedOptions.some(option => option === value);
  }

}

import { Component, Output, Input, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

import { FilterOperator, EqualsOperator } from '../../models';

@Component({
  selector: 'pf-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss']
})
export class MultiSelectFilterComponent {
  @Input() selectedOperator: FilterOperator;
  @Input() options: string[];
  @Input() selectedOptions: string[];
  @Input() filterValue: string;
  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedValuesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  @ViewChild('filterOptionsMultiSelect', {static: false}) public filterOptionsMultiSelect: MultiSelectComponent;
  operators = [ EqualsOperator ];
  readonly MIN_QUERY_LENGTH = 2;

  handleFilterOptionsMultiSelectOpen(event: any) {
    if (!this.filterValue || this.filterValue.length < this.MIN_QUERY_LENGTH) {
      event.preventDefault();
    }
  }

  handleFilterChange(value: string): void {
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

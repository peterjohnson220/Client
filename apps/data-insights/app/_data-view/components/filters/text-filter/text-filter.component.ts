import { Component, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { FilterOperator, Contains, DoesNotContain, IsNotNullOrEmpty, IsNullOrEmpty } from '../../../models';

@Component({
  selector: 'pf-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss']
})
export class TextFilterComponent implements OnChanges {
  @Input() selectedOperator: FilterOperator;
  @Input() filterValue: string;
  @Output() valueChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() changeOperator: EventEmitter<FilterOperator> = new EventEmitter<FilterOperator>();

  operators = [ Contains, DoesNotContain, IsNullOrEmpty, IsNotNullOrEmpty ];
  value: string;
  hideInput: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    const operatorName =  changes.selectedOperator.currentValue.Name;
    if (changes.filterValue) {
      this.value = this.filterValue;
    }
    this.hideInput = operatorName === 'is null or empty' || operatorName === 'is not null or empty';
  }

  handleTextChanged() {
    if (this.value) {
      this.valueChanged.emit([this.value]);
    } else {
      this.valueChanged.emit([]);
    }
  }

  handleChangeOperator(value: FilterOperator) {
    this.changeOperator.emit(value);
  }

}

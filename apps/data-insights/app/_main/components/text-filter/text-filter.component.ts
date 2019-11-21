import { Component, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { FilterOperator, Contains, DoesNotContain } from '../../models';

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

  operators = [ Contains, DoesNotContain ];
  value: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterValue) {
      this.value = this.filterValue;
    }
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

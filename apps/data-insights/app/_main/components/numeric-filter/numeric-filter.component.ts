import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EqualsOperator, FilterOperator, GreaterThanOperator, GreaterThanOrEqualOperator, LessThanOperator, LessThanOrEqualOperator } from '../../models';

@Component({
  selector: 'pf-numeric-filter',
  templateUrl: './numeric-filter.component.html',
  styleUrls: ['./numeric-filter.component.scss']
})
export class NumericFilterComponent implements OnInit {
  @Input() numericValue: string;
  @Input() selectedOperator: FilterOperator;
  @Output() numericValuesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() changeOperator: EventEmitter<FilterOperator> = new EventEmitter<FilterOperator>();
  operators = [EqualsOperator, GreaterThanOperator, GreaterThanOrEqualOperator, LessThanOperator, LessThanOrEqualOperator];

  previousValue: string;

  ngOnInit() {
    this.previousValue = this.numericValue;
  }

  handleNumericValueChange(): void {
    if (this.numericValue === null || this.numericValue.length === 0) {
      if (this.previousValue === null || this.previousValue.length === 0  ) {
        this.numericValue = '';
        return;
      }
      this.numericValue = this.previousValue;
    }

    this.previousValue = this.numericValue;
    this.numericValuesChanged.emit([this.numericValue]);
  }

  handleChangeOperator(value: FilterOperator) {
   this.changeOperator.emit(value);
  }

}

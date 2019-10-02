import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EqualsOperator, FilterOperator, GreaterThanOperator, GreaterThanOrEqualOperator, LessThanOperator, LessThanOrEqualOperator } from '../../models';

@Component({
  selector: 'pf-numeric-filter',
  templateUrl: './numeric-filter.component.html',
  styleUrls: ['./numeric-filter.component.scss']
})
export class NumericFilterComponent {
  @Input() numericValue: string;
  @Input() selectedOperator: FilterOperator;
  @Output() numericValuesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() changeOperator: EventEmitter<FilterOperator> = new EventEmitter<FilterOperator>();
  operators = [EqualsOperator, GreaterThanOperator, GreaterThanOrEqualOperator, LessThanOperator, LessThanOrEqualOperator];

  previousValue: string;

  handleNumericValueChange(): void {
    if (this.numericValue === null) {
      this.numericValue = this.previousValue;
    }

    this.previousValue = this.numericValue;
    this.numericValuesChanged.emit([this.numericValue]);
  }

  handleChangeOperator(value: FilterOperator) {
   this.changeOperator.emit(value);
  }

}

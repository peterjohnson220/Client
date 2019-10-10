import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EqualsOperator, FilterOperator, GreaterThanOperator, GreaterThanOrEqualOperator, LessThanOperator, LessThanOrEqualOperator } from '../../models';

@Component({
  selector: 'pf-numeric-filter',
  templateUrl: './numeric-filter.component.html',
  styleUrls: ['./numeric-filter.component.scss']
})
export class NumericFilterComponent implements OnInit {
  @Input() dataType: string;
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
    if (isNaN(Number(this.numericValue)) || this.numericValue.length === 0) {
      this.numericValue = this.previousValue.length !== 0 ? this.previousValue : '';
      return;
    }

    if (this.dataType === 'int' && Number(this.numericValue) % 1 !== 0 ) {
     this.numericValue = this.numericValue.split('.')[0];
    }

    this.previousValue = this.numericValue;
    this.numericValuesChanged.emit([this.numericValue]);
  }

  handleChangeOperator(value: FilterOperator) {
   this.changeOperator.emit(value);
  }

}

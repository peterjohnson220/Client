import { Component, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

import { Equals, FilterOperator, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual } from 'libs/ui/formula-editor';

@Component({
  selector: 'pf-numeric-filter',
  templateUrl: './numeric-filter.component.html',
  styleUrls: ['./numeric-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumericFilterComponent implements OnChanges {
  @Input() value: string;
  @Input() selectedOperator: FilterOperator;
  @Input() format: string;
  @Input() step: number;
  @Output() numericValuesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() changeOperator: EventEmitter<FilterOperator> = new EventEmitter<FilterOperator>();
  operators = [Equals, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual];

  numberValue: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.setNumberValue();
    }
  }

  handleNumericValueChange(value: number): void {
    this.numberValue = value;
    if (value === null) {
      this.numericValuesChanged.emit([]);
    } else {
      this.numericValuesChanged.emit([this.numberValue.toString()]);
    }
  }

  handleChangeOperator(value: FilterOperator) {
   this.changeOperator.emit(value);
  }

  private setNumberValue() {
    if (this.value) {
      this.numberValue = Number(this.value);
    } else {
      this.numberValue = null;
    }
  }
}

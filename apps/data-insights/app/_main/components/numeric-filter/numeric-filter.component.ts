import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { DataViewFieldDataType } from 'libs/models/payfactors-api/reports/request';

import {
  EqualsOperator,
  FilterOperator,
  GreaterThanOperator,
  GreaterThanOrEqualOperator,
  LessThanOperator,
  LessThanOrEqualOperator
} from '../../models';


@Component({
  selector: 'pf-numeric-filter',
  templateUrl: './numeric-filter.component.html',
  styleUrls: ['./numeric-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumericFilterComponent implements OnChanges {
  @Input() dataType: DataViewFieldDataType;
  @Input() value: string;
  @Input() selectedOperator: FilterOperator;
  @Output() numericValuesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() changeOperator: EventEmitter<FilterOperator> = new EventEmitter<FilterOperator>();
  operators = [EqualsOperator, GreaterThanOperator, GreaterThanOrEqualOperator, LessThanOperator, LessThanOrEqualOperator];

  numberValue: number;
  decimals: number;
  numberFormat: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.setNumberValue();
    }
    if (changes.dataType) {
      this.setInputOptions();
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

  private setInputOptions() {
    if (this.dataType === DataViewFieldDataType.Int) {
      this.decimals = 0;
    } else {
      this.decimals = 2;
    }
    this.numberFormat = `n${this.decimals}`;
  }
}

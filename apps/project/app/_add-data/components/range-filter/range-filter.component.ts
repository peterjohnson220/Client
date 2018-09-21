import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ChangeContext, Options } from 'ng5-slider';

import { RangeFilter } from '../../models';

@Component({
    selector: 'pf-range-filter',
    templateUrl: './range-filter.component.html',
    styleUrls: ['./range-filter.component.scss']
})
export class RangeFilterComponent implements OnChanges {
    @Input() filter: RangeFilter;
    @Input() precision: number;
    @Output() rangeChange: EventEmitter<{filterId: string, minValue: number, maxValue: number}> = new EventEmitter();

    showRangeControl: boolean;
    selectedMin: number;
    selectedMax: number;
    options: Options;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
      if (changes.filter) {
        this.showRangeControl = this.filter.MinimumValue !== this.filter.MaximumValue && this.filter.MaximumValue > 0;
        this.setSelectedMinAndMax();
        this.options = this.buildUpOptions();
      }
    }

    handleRangeSliderChange(filterId: string, changeContext: ChangeContext) {
      this.rangeChange.emit({filterId: filterId, minValue: changeContext.value, maxValue: changeContext.highValue});
    }

    buildUpOptions(): Options {
      let tempPrecision = this.getPrecision();

      if (!!this.precision) {
        tempPrecision = this.precision;
      }

      return {
        floor: this.filter.MinimumValue,
        ceil: this.filter.MaximumValue,
        showTicks: false,
        step: 0.01,
        precision: tempPrecision
      };
    }

    setSelectedMinAndMax() {
      this.selectedMin = this.filter.SelectedMinValue || this.filter.MinimumValue;
      this.selectedMax = this.filter.SelectedMaxValue || this.filter.MaximumValue;
    }

    getPrecision(): number {
      if (!!this.filter && !!this.filter.MaximumValue && this.filter.MaximumValue % 1 !== 0) {
        return (this.filter.MaximumValue + '').split('.')[1].length;
      } else {
        return 1;
      }
    }
}

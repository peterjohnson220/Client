import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ChangeContext, Options } from 'ng5-slider';

import { RangeFilter } from '../../../models';

@Component({
    selector: 'pf-range-filter',
    templateUrl: './range-filter.component.html',
    styleUrls: ['./range-filter.component.scss']
})
export class RangeFilterComponent implements OnChanges {
    @Input() filter: RangeFilter;
    @Input() precision: number;
    @Input() manualRefreshOnChange: false;
    @Output() rangeChange: EventEmitter<{filterId: string, minValue: number, maxValue: number}> = new EventEmitter();

    manualRefresh: EventEmitter<void> = new EventEmitter<void>();
    showRangeControl: boolean;
    selectedMin: number;
    selectedMax: number;
    options: Options;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {

      // The ng5 slider has some issues with CSS after display is updated. Need to refresh the control after change
      // detection is run: https://github.com/angular-slider/ng5-slider#documentation
      if (this.manualRefreshOnChange) {
        window.setTimeout(() => this.manualRefresh.emit());
      }

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
      return {
        floor: this.filter.MinimumValue,
        ceil: this.filter.MaximumValue,
        showTicks: false,
        step: 0.01,
        precision: this.precision || this.filter.Precision,
        // Precision of 1 drops the "." for whole numbers, need this custom translation
        translate: (value: number): string => {
          return value.toFixed(this.precision || this.filter.Precision);
        }
      };
    }

    setSelectedMinAndMax() {
      this.selectedMin = this.filter.SelectedMinValue || this.filter.MinimumValue;
      this.selectedMax = this.filter.SelectedMaxValue || this.filter.MaximumValue;
    }
}

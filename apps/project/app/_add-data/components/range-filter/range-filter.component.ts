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
    @Output() rangeChange: EventEmitter<{filterId: string, minValue: number, maxValue: number}> = new EventEmitter();
    showRangeControl: boolean;

    options: Options;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
      if (changes.filter) {
        this.showRangeControl = this.filter.MinimumValue !== this.filter.MaximumValue && this.filter.MaximumValue > 0;
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
        translate: (value: number): string => {
          return '$' + value;
        }
      };
    }
}

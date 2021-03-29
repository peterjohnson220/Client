import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'pf-radial-text-counter',
  templateUrl: './radial-text-counter.component.html',
  styleUrls: ['./radial-text-counter.component.scss'],
})
export class RadialTextCounterComponent implements OnChanges {
  // If warning/danger colors need to be used in non-character count situation, start number refactor to be percent based will be necessary
  @Input() WarningStartNumber = 1500;
  @Input() DangerStartNumber = 1950;
  @Input() AvailableLength: number;
  @Input() ContentLength: number;
  @Input() ShowTextRemainingTooltip: boolean;
  @Input() DisplayWarningColors = false;

  // circumference of circle with radius of 6
  private readonly radialStartValue = 37.6991;
  radialStrokeDashOffsetValue: number = this.radialStartValue;
  radialCounterClass = 'radial-counter-safe';
  charactersRemaining: number;
  radialIncrementValue: number;

  ngOnChanges(changes: SimpleChanges): void {
    this.radialIncrementValue = this.radialStartValue / this.AvailableLength;

    if (changes.ContentLength) {
      this.charactersRemaining = this.AvailableLength - this.ContentLength;
      const spaceUsedPercent = this.ContentLength / this.AvailableLength;
      this.radialStrokeDashOffsetValue = (spaceUsedPercent < 1) ? this.radialStartValue * (1 - (spaceUsedPercent)) : 0;

      if (this.DisplayWarningColors) {
        this.radialCounterClass = this.ContentLength >= this.WarningStartNumber && this.ContentLength < this.DangerStartNumber
          ? 'radial-counter-warn radial-counter-pulse'
          : this.ContentLength >= this.DangerStartNumber
            ? 'radial-counter-danger radial-counter-pulse'
            : 'radial-counter-safe';
      }
    }
  }

  get tooltipText(): string {
    if (this.ShowTextRemainingTooltip) {
      return this.charactersRemaining + ' characters remaining';
    }
    return this.ContentLength >= this.AvailableLength ? 'No space remaining' : 'Space remaining';
  }
}

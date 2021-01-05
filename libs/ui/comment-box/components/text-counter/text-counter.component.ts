import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-text-counter',
  templateUrl: './text-counter.component.html',
  styleUrls: ['./text-counter.component.scss'],
})
export class TextCounterComponent  {
  @Input() textMaxLength = 2000;
  @Input() warningStartNumber = 1500;
  @Input() dangerStartNumber = 1950;

  radialStartValue = 50.2655;
  radialStrokeDashOffsetValue: any = this.radialStartValue;
  radialCounterClass = 'radial-counter-safe';
  charactersRemaining = this.textMaxLength;
  radialIncrementValue: number;

  @Input()
  set textToCount(textToCount: string) {
    this.radialIncrementValue = this.radialStartValue / this.textMaxLength;
    const inputTextLength = !!textToCount ? textToCount.length : 0;

    this.radialStrokeDashOffsetValue = (this.radialStartValue - (inputTextLength * this.radialIncrementValue ));
    this.charactersRemaining = this.textMaxLength - inputTextLength;

    if (inputTextLength >= this.warningStartNumber && inputTextLength < this.dangerStartNumber) {
      this.radialCounterClass = 'radial-counter-warn radial-counter-pulse';
    } else if (inputTextLength >= this.dangerStartNumber) {
      this.radialCounterClass = 'radial-counter-danger radial-counter-pulse';
    } else {
      this.radialCounterClass = 'radial-counter-safe';
    }
  }

  reset(): void {
    this.charactersRemaining = this.textMaxLength;
    this.radialStrokeDashOffsetValue = this.radialStartValue;
  }
}


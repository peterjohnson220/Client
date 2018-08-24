import {Component, Input} from '@angular/core';

@Component({
  selector: 'pf-radial-text-counter',
  templateUrl: './radial-text-counter.component.html',
  styleUrls: ['./radial-text-counter.component.scss'],
})
export class RadialTextCounterComponent  {
  @Input()
  textMaxLength = 2000;

  @Input()
    WarningStartNumber = 1500;

  @Input()
    DangerStartNumber = 1950;

  radialStartValue = 50.2655;
  radialStrokeDashOffsetValue: any = this.radialStartValue;
  radialCounterClass = 'radial-counter-safe';
  charactersRemaining = this.textMaxLength;
  radialIncrementValue = this.radialStartValue / this.textMaxLength;

  @Input()
  set textToCount(textToCount: string) {

    const inputTextLength = textToCount !== null ? textToCount.length : 0;

    this.radialStrokeDashOffsetValue = (this.radialStartValue - (inputTextLength * this.radialIncrementValue ));
    this.charactersRemaining = this.textMaxLength - inputTextLength;

    if (inputTextLength >= this.WarningStartNumber && inputTextLength < this.DangerStartNumber) {
      this.radialCounterClass = 'radial-counter-warn radial-counter-pulse';
    } else if (inputTextLength >= this.DangerStartNumber) {
      this.radialCounterClass = 'radial-counter-danger radial-counter-pulse';
    } else {
      this.radialCounterClass = 'radial-counter-safe';
    }
  }
}


import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-loading-indicator',
  templateUrl: './loading-indicator.component.html'
})
export class LoadingIndicatorComponent {
  @Input() spinnerType = 'SVG';
  @Input() message: string;

  spinnerGifUrl = '../../marketdata/images/waittrans.gif';

}

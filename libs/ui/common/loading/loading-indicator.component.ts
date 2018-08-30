import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-loading-indicator',
  templateUrl: './loading-indicator.component.html'
})
export class LoadingIndicatorComponent {
  @Input() spinnerType = 'SVG';

  spinnerGifUrl = '../../marketdata/images/waittrans.gif';

}

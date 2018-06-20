import { Component } from '@angular/core';

import { WindowCommunicationService } from 'libs/core/services';

@Component({
  selector: 'pf-add-data-surveys-page',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss']
})
export class SurveysPageComponent {

  constructor(
    private windowCommunicationService: WindowCommunicationService
  ) {}

  handleCancelClicked() {
    // TODO[BC]: Once we have state this will be move to an effect
    this.windowCommunicationService.postMessage('Survey Search - Cancel Clicked');
  }
}

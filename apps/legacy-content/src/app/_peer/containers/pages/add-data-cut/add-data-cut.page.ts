import { Component } from '@angular/core';

import { WindowCommunicationService } from 'libs/core/services';

@Component({
  selector: 'pf-add-data-cut-page',
  templateUrl: './add-data-cut.page.html',
  styleUrls: ['./add-data-cut.page.scss']
})
export class AddDataCutPageComponent {

  constructor(private windowCommunicationService: WindowCommunicationService) {  }

  add() {
    this.windowCommunicationService.postMessage('[Peer/Add Data Cut] Add');
  }

  cancel() {
    this.windowCommunicationService.postMessage('[Peer/Add Data Cut] Cancel');
  }
}

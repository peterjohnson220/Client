import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ExchangeJobRequest } from 'libs/models/peer';

@Component({
  selector: 'pf-exchange-job-request-info',
  templateUrl: './exchange-job-request-info.component.html',
  styleUrls: [ './exchange-job-request-info.component.scss' ]
})

export class ExchangeJobRequestInfoComponent {
  @Input() selectedJobRequest: ExchangeJobRequest;
  @Output() closeClicked = new EventEmitter();

  close() {
    this.closeClicked.emit();
  }
}

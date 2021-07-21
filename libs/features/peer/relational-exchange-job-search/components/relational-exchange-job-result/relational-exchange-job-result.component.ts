import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RelationalExchangeJobResult } from 'libs/models';

@Component({
  selector: 'pf-relational-exchange-job-result',
  templateUrl: './relational-exchange-job-result.component.html',
  styleUrls: ['./relational-exchange-job-result.component.scss']
})
export class RelationalExchangeJobResultComponent {
  @Input() exchangeJob: RelationalExchangeJobResult;

  @Output() exchangeJobClicked: EventEmitter<RelationalExchangeJobResult> = new EventEmitter<RelationalExchangeJobResult>();

  constructor() { }

  handleExchangeJobClicked() {
    return this.exchangeJobClicked.emit(this.exchangeJob);
  }

}

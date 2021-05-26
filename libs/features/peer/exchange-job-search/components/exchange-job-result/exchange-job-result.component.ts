import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'pf-exchange-job-result',
  templateUrl: './exchange-job-result.component.html',
  styleUrls: ['./exchange-job-result.component.scss']
})
export class ExchangeJobResultComponent {
  @Input() exchangeJob: any; // TODO: [JP] TYPE

  @Output() exchangeJobClicked: EventEmitter<any> = new EventEmitter<any>(); // TODO: [JP] TYPE

  constructor() { }

  handleExchangeJobClicked() {
    return this.exchangeJobClicked.emit(this.exchangeJob);
  }

}

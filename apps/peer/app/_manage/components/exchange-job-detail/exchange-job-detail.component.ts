import { Component, Input } from '@angular/core';

import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

@Component({
  selector: 'pf-exchange-job-detail',
  templateUrl: './exchange-job-detail.component.html',
  styleUrls: ['./exchange-job-detail.component.scss']
})
export class ExchangeDetailComponent {
  @Input() exchangeJobLoading: boolean;
  @Input() exchangeJobLoadingSuccess: boolean;
  @Input() exchangeJobLoadingError: boolean;
  @Input() exchangeJob: ExchangeJob;

  constructor() { }

}

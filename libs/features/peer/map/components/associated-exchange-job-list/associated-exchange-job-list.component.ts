import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-associated-exchange-job-list',
  templateUrl: './associated-exchange-job-list.component.html',
  styleUrls: ['./associated-exchange-job-list.component.scss']
})
export class AssociatedExchangeJobListComponent {

  @Input() associatedExchangeJobs = [];

  constructor() { }

  associatedJobsAsString(): string {
    return this.associatedExchangeJobs.join(', ');
  }
}

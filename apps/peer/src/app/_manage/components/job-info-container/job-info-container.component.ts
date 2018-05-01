import { Component, Input } from '@angular/core';

import { Job } from 'libs/models';

@Component({
  selector: 'pf-job-info-container',
  templateUrl: './job-info-container.component.html',
  styleUrls: ['./job-info-container.component.scss']
})
export class JobInfoContainerComponent {
  @Input() job: Job;
  @Input() showJobCode: boolean;

  constructor() {}
}

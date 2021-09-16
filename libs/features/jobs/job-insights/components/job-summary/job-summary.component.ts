import { Component, Input } from '@angular/core';

import { MULTIPLE_JOB_DESCRIPTIONS } from 'libs/core';

import { JobInsightsMode } from '../../models';

@Component({
  selector: 'pf-job-insights-job-summary',
  templateUrl: './job-summary.component.html',
  styleUrls: ['./job-summary.component.scss']
})
export class JobInsightsJobSummaryComponent {
  @Input() mode: JobInsightsMode = JobInsightsMode.Edit;
  @Input() jobSummary: string;

  editMode = JobInsightsMode.Edit;
  printMode = JobInsightsMode.Print;
  multipleJobDescriptions = MULTIPLE_JOB_DESCRIPTIONS;
}

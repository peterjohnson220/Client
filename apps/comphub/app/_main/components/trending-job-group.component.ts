import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TrendingJob } from '../models/trending-job.model';

@Component({
  selector: 'pf-trending-job-group',
  templateUrl: './trending-job-group.component.html',
  styleUrls: ['./trending-job-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrendingJobGroupComponent {
  @Input() groupName: string;
  @Input() trendingJobs: TrendingJob[];

  constructor() {}
}

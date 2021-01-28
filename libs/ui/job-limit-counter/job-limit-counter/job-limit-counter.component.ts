import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pf-job-limit-counter',
  templateUrl: './job-limit-counter.component.html',
  styleUrls: ['./job-limit-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobLimitCounterComponent {
  @Input() jobUsageCount: number;
  @Input() numberOfSearchResults: number;
  @Input() maxAllowedJobsSetting: number;
  @Input() currentJobCountSetting: number;

  // Local variables
  readonly jobCountTooltipText = ``;
  readonly maxJobsReachedTooltipText = ``;
  readonly progressBarJobLimitReachedText = `Job limit reached`;
  readonly smallBusinessEmail = 'smb@payfactors.com';
  readonly warningPercentage = 0.9;

  get progressBarType(): string {
    if (this.jobUsageCount === this.maxAllowedJobsSetting) {
      return 'danger';
    } else if (this.jobUsageCount >= this.warningThreshold) {
      return 'warning';
    } else {
      return 'success';
    }
  }

  get usedJobCountLabelColor(): string {
    if (this.jobUsageCount === this.maxAllowedJobsSetting) {
      return '#dc3545';
    } else if (this.jobUsageCount >= this.warningThreshold) {
      return '#ffc107';
    } else {
      return '#28a745';
    }
  }

  get warningThreshold(): number {
    // Warning threshold: 90% of job limit
    return this.maxAllowedJobsSetting * this.warningPercentage;
  }

  get progressBarText(): string {
    if (this.jobUsageCount === this.maxAllowedJobsSetting) {
      return this.progressBarJobLimitReachedText;
    }
    return '';
  }
}

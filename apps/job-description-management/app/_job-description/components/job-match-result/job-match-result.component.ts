import { Component, Input } from '@angular/core';
import { JobMatchResult } from 'libs/features/jobs/job-description-management/models';

@Component({
  selector: 'pf-job-match-result',
  templateUrl: './job-match-result.component.html',
  styleUrls: ['./job-match-result.component.scss']
})
export class JobMatchResultComponent {
  @Input() jobMatchResult: JobMatchResult;

  showMore: boolean;

  toggleShowMore(event: MouseEvent): void {
    event.stopPropagation();
    this.showMore = !this.showMore;
  }
}

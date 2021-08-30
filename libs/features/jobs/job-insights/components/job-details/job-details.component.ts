import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GenericKeyValue } from 'libs/models/common';

import { JobInsightsMode } from '../../models';

@Component({
  selector: 'pf-job-insights-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobInsightsJobDetailsComponent implements OnChanges {
  @Input() mode = JobInsightsMode.Edit;
  @Input() standardFields: GenericKeyValue<string, string>[];
  @Input() customFields: GenericKeyValue<string, string>[];

  isViewMore: boolean;
  jobInsightsPrintMode = JobInsightsMode.Print;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.customFields?.currentValue) {
      this.isViewMore = false;
    }
  }

  toggleViewMore(): void {
    this.isViewMore = !this.isViewMore;
  }
}

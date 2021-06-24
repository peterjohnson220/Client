import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj, JobDescriptionSummary } from 'libs/models';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';

import { MULTIPLE_JOB_DESCRIPTIONS } from 'libs/core';

import * as fromJobsPageReducer from '../../../../reducers';
import * as fromJobDescriptionActions from '../../../../actions';

@Component({
  selector: 'pf-job-insights',
  templateUrl: './job-insights.component.html',
  styleUrls: ['./job-insights.component.scss']
})
export class JobInsightsComponent implements OnChanges {
  @Input() filters: PfDataGridFilter[];

  jobDescriptionSummaryAsync$: Observable<AsyncStateObj<JobDescriptionSummary>>;

  multipleJobDescriptions = MULTIPLE_JOB_DESCRIPTIONS;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
  ) {
    this.jobDescriptionSummaryAsync$ = this.store.select(fromJobsPageReducer.getJobDescriptionSummary);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']?.currentValue) {
      const companyJobIdFilter: PfDataGridFilter = this.filters.find(i => i.SourceName === 'CompanyJob_ID');
      if (companyJobIdFilter?.Values?.length > 0) {
        this.store.dispatch(new fromJobDescriptionActions.LoadJobDescription((<any>companyJobIdFilter.Values[0]) as number));
      }
    }
  }
}

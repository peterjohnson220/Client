import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { AsyncStateObj, GenericKeyValue, UserContext } from 'libs/models/';
import { JobInsights } from 'libs/models/payfactors-api';

import * as fromJobInsightsMainReducer from '../reducers';
import * as fromJobInsightsActions from '../actions/job-insights.actions';
import { JobInsightsHelper } from './job-insights.helper';

@Component({
  template: ''
})
export abstract class AbstractJobInsightsComponent implements OnInit, OnDestroy {
  jobInsightsAsync$: Observable<AsyncStateObj<JobInsights>>;
  userContext$: Observable<UserContext>;

  jobInsightsAsyncSubscription: Subscription;

  companyJobId: number;
  companyPayMarketId: number;
  jobInsights: JobInsights;
  standardFields: GenericKeyValue<string, string>[];
  customFields: GenericKeyValue<string, string>[];
  companyJobCustomFields: GenericKeyValue<string, string>[];

  constructor(
    protected jobInsightsMainStore: Store<fromJobInsightsMainReducer.State>,
    protected rootStore: Store<fromRootState.State>
  ) {
    this.jobInsightsAsync$ = this.jobInsightsMainStore.select(fromJobInsightsMainReducer.getJobInsights);
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
  }

  ngOnInit(): void {
    this.jobInsightsAsyncSubscription = this.jobInsightsAsync$.subscribe((asyncObj) => {
      if (!asyncObj?.loading && asyncObj.obj) {
        this.jobInsights = asyncObj.obj;
        this.handleJobInsightsLoaded();
      }
    });
  }

  ngOnDestroy(): void {
    this.jobInsightsAsyncSubscription.unsubscribe();
    this.jobInsightsMainStore.dispatch(new fromJobInsightsActions.ResetJobInsights());
  }

  protected loadJobInsights(): void {
    if (this.companyJobId && this.companyPayMarketId) {
      this.jobInsightsMainStore.dispatch(new fromJobInsightsActions.LoadJobInsights({
        CompanyJobId: this.companyJobId,
        CompanyPayMarketId: this.companyPayMarketId
      }));
    }
  }

  protected loadJobInsightsForPrint(): void {
    if (this.companyJobId && this.companyPayMarketId) {
      this.jobInsightsMainStore.dispatch(new fromJobInsightsActions.LoadJobInsightsForPrint({
        CompanyJobId: this.companyJobId,
        CompanyPayMarketId: this.companyPayMarketId
      }));
    }
  }

  protected updateJobDetails(): void {
    if (!this.jobInsights?.Job || !this.companyJobCustomFields) {
      return;
    }
    this.standardFields = JobInsightsHelper.mapJobDataToGenericKeyValues(this.jobInsights.Job);
    this.customFields = JobInsightsHelper.getCustomFieldsWithValues(this.jobInsights.Job, this.companyJobCustomFields);
  }

  protected loadJobCustomFields(companyId: number): void {
    this.jobInsightsMainStore.dispatch(new fromJobInsightsActions.LoadCustomJobFields({ companyId }));
  }

  protected abstract handleJobInsightsLoaded(): void;

}

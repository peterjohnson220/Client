import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import { AsyncStateObj, JobDescriptionSummary, PayMarket, UserContext } from 'libs/models';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import * as fromRootState from 'libs/state/state';
import cloneDeep from 'lodash/cloneDeep';
import { MULTIPLE_JOB_DESCRIPTIONS } from 'libs/core';

import * as fromJobsPageReducer from '../../../../reducers';
import * as fromJobDescriptionActions from '../../../../actions';

@Component({
  selector: 'pf-job-insights',
  templateUrl: './job-insights.component.html',
  styleUrls: ['./job-insights.component.scss']
})
export class JobInsightsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() filters: PfDataGridFilter[];

  jobDescriptionSummaryAsync$: Observable<AsyncStateObj<JobDescriptionSummary>>;
  userContext$: Observable<UserContext>;

  payMarketsSubscription: Subscription;
  gridFieldSubscription: Subscription;
  userContextSubscription: Subscription;

  multipleJobDescriptions = MULTIPLE_JOB_DESCRIPTIONS;
  payMarkets: PayMarket[];
  selectedPayMarketId: number;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private rootStore: Store<fromRootState.State>
  ) {
    this.jobDescriptionSummaryAsync$ = this.store.select(fromJobsPageReducer.getJobDescriptionSummary);
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
  }

  ngOnInit(): void {
    this.payMarketsSubscription = this.store.select(fromJobsPageReducer.getCompanyPayMarkets).subscribe(payMarkets => {
      if (!!payMarkets?.length) {
        this.payMarkets = cloneDeep(payMarkets);
        this.selectedPayMarketId = this.selectedPayMarketId ?? this.payMarkets[0].CompanyPayMarketId;
      }
    });
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (uc) {
        this.selectedPayMarketId = uc.DefaultPayMarketId;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']?.currentValue) {
      const companyJobIdFilter: PfDataGridFilter = this.filters.find(i => i.SourceName === 'CompanyJob_ID');
      if (companyJobIdFilter?.Values?.length > 0) {
        this.store.dispatch(new fromJobDescriptionActions.LoadJobDescription((<any>companyJobIdFilter.Values[0]) as number));
      }
    }
  }

  ngOnDestroy(): void {
    this.payMarketsSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
  }

  handlePayMarketValueChanged(value: number): void {
    this.selectedPayMarketId = value;
  }
}

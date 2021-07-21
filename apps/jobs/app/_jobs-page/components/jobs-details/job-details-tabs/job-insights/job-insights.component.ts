import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
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
  payMarkets$: Observable<PayMarket[]>;

  forkJoinSubscription: Subscription;
  gridFieldSubscription: Subscription;

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
    this.payMarkets$ = this.store.select(fromJobsPageReducer.getCompanyPayMarkets);
  }

  ngOnInit(): void {
    this.forkJoinSubscription = forkJoin([this.getPayMarketsLoaded(), this.getUserContextLoaded()])
      .subscribe(([payMarkets, userContext]) => {
        this.selectedPayMarketId = userContext?.DefaultPayMarketId
          ? userContext.DefaultPayMarketId
          : payMarkets?.length ? payMarkets[0].CompanyPayMarketId : null;
        this.payMarkets = cloneDeep(payMarkets);
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
    this.forkJoinSubscription.unsubscribe();
  }

  handlePayMarketValueChanged(value: number): void {
    this.selectedPayMarketId = value;
  }

  private getPayMarketsLoaded(): Observable<PayMarket[]> {
    return this.payMarkets$.pipe(
      filter(f => !!f && f.length > 0),
      take(1)
    );
  }

  private getUserContextLoaded(): Observable<UserContext> {
    return this.userContext$.pipe(
      filter(f => !!f),
      take(1)
    );
  }
}

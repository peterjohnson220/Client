import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'hammerjs'; // Required for chart methods like seriesClick.
import * as cloneDeep from 'lodash.clonedeep';

import { Exchange, GetChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromExchangeDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-exchange-job-family-chart',
  templateUrl: './exchange-job-family-chart.component.html',
  styleUrls: ['./exchange-job-family-chart.component.scss']
})

export class ExchangeJobFamilyChartComponent implements OnInit, OnDestroy {
  exchangeId: number;
  exchange$: Observable<Exchange>;
  jobFamilyChartItems$: Observable<ChartItem[]>;
  jobFamilyChartItemsSubscription: Subscription;
  jobFamilyChartItems: ChartItem[];
  loadingJobFamilyChartItems$: Observable<boolean>;
  loadingJobFamilyChartItemsError$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromExchangeDashboardReducer.State>
  ) {
    this.exchange$ = this.store.select(fromExchangeDashboardReducer.getExchange);
    this.jobFamilyChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardJobFamilyChartItems);
    this.loadingJobFamilyChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingJobFamilyChart);
    this.loadingJobFamilyChartItemsError$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingJobFamilyChartError);
    this.exchangeId = this.route.snapshot.params.id;
  }

  getValueAxisMax(): number {
    return this.jobFamilyChartItems && this.jobFamilyChartItems.length < 2 ? 1 : null;
  }

  getCategoryLabelRotation(): number {
    return this.jobFamilyChartItems && this.jobFamilyChartItems.length < 3 ? 0 : -45;
  }

  seriesClick(e): void {
    const getDetailChartRequest: GetChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Family,
      Category: e.category
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingDetailChart(getDetailChartRequest));
  }

  ngOnInit() {
    const getChartRequest: GetChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Family
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingJobFamilyChart(getChartRequest));
    this.jobFamilyChartItemsSubscription = this.jobFamilyChartItems$.subscribe(chartItems => {
      this.jobFamilyChartItems = cloneDeep(chartItems);
    });
  }

  ngOnDestroy() {
    this.jobFamilyChartItemsSubscription.unsubscribe();
  }
}

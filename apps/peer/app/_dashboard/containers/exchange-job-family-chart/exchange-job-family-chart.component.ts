import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { GetDetailChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromPeerDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-exchange-job-family-chart',
  templateUrl: './exchange-job-family-chart.component.html',
  styleUrls: ['./exchange-job-family-chart.component.scss']
})

export class ExchangeJobFamilyChartComponent implements OnInit, OnDestroy {
  exchangeId: number;
  jobFamilyChartItems$: Observable<ChartItem[]>;
  jobFamilyChartItemsSubscription: Subscription;
  jobFamilyChartItems: ChartItem[];
  loadingJobFamilyChartItems$: Observable<boolean>;
  loadingJobFamilyChartItemsError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private route: ActivatedRoute
  ) {
    this.jobFamilyChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardJobFamilyChartItems);
    this.loadingJobFamilyChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingJobFamilyChart);
    this.loadingJobFamilyChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingJobFamilyChartError);
    this.route.paramMap.subscribe((params: ParamMap) => this.exchangeId = +params.get('id'));
  }

  getValueAxisMax(): number {
    return this.jobFamilyChartItems && this.jobFamilyChartItems.length < 2 ? 1 : null;
  }

  getCategoryLabelRotation(): number {
    return this.jobFamilyChartItems && this.jobFamilyChartItems.length < 3 ? 0 : -45;
  }

  seriesClick(e): void {
    const getDetailChartRequest: GetDetailChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Family,
      Category: e.category
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadDetailChart(getDetailChartRequest));
  }

  ngOnInit() {
    this.jobFamilyChartItemsSubscription = this.jobFamilyChartItems$.subscribe(chartItems => {
      this.jobFamilyChartItems = cloneDeep(chartItems);
    });
  }

  ngOnDestroy() {
    this.jobFamilyChartItemsSubscription.unsubscribe();
  }
}

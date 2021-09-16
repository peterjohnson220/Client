import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';

import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';
import { AsyncStateObj } from 'libs/models/state';

import { PricingGraphTypeEnum, getDefaultChartSettings } from '../../models';
import { JobPricingGraphService } from '../../services/job-pricing-graph.service';
import * as fromJobPricingGraphActions from '../../actions';
import * as fromJobPricingGraphReducer from '../../reducers';
import { AbstractJobPricingGraphDirective } from '../common/abstract-job-pricing-graph.directive';

@Component({
  selector: 'pf-job-pricing-base-graph',
  templateUrl: '../common/job-pricing-graph.component.html',
  styleUrls: ['./job-pricing-base-graph.component.scss', '../../styles/graph-styles.scss']
})
export class JobPricingBaseGraphComponent extends AbstractJobPricingGraphDirective implements OnInit, OnDestroy {
  @Input() companyEmployeeId: number = null;

  pricingData$: Observable<AsyncStateObj<PricingForPayGraph>>;

  dataUpdatedSubscription: Subscription;
  payDataSuccessSubscription: Subscription;

  chartRef: Highcharts.Chart;

  constructor(
    private store: Store<fromJobPricingGraphReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
    super(store);
    this.graphType = PricingGraphTypeEnum.Base;
    this.chartSettings = {
      ...getDefaultChartSettings(),
      PayLabel: 'Base Pay'
    };
  }

  ngOnInit(): void {
    this.chartOptions = JobPricingGraphService.getPricingGraphChartOptions(this.chartSettings);
    this.pricingData$ = this.store.select(fromJobPricingGraphReducer.getBasePayPricing);

    this.payDataSuccessSubscription = this.actionsSubject.pipe(
      ofType(fromJobPricingGraphActions.LOAD_GRAPH_PAY_DATA_SUCCESS)
    ).subscribe((action: fromJobPricingGraphActions.LoadGraphPayDataSuccess) => {
      this.store.dispatch(new fromJobPricingGraphActions.GetBasePricingData(this.companyJobId, this.paymarketId, action.payData));
    });

    this.dataUpdatedSubscription = this.actionsSubject.pipe(
      ofType(fromJobPricingGraphActions.GET_BASE_PRICING_DATA_SUCCESS)
    ).subscribe((action: fromJobPricingGraphActions.GetBasePricingDataSuccess) => {
      this.isValidPricingData = JobPricingGraphService.validatePricingForPayGraph(action.pricing);
      this.pricingData = action.pricing;
      this.payData = action.payData;
      this.updateChartData();
    });
  }

  ngOnDestroy() {
    this.dataUpdatedSubscription.unsubscribe();
    this.payDataSuccessSubscription.unsubscribe();
  }

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    if (!this.chartRef?.axes?.length) {
      this.chartRef = chart;
      this.updateChartData();
    }
  }

  updateChartData(): void {
    if (!this.pricingData) {
      return;
    }
    const scatterData = [];
    const counts = {};
    let payDataValues = [];

    if (this.payData?.length) {
      payDataValues = this.payData.map(a => a.Base / 1000);

      this.payData.forEach(function (x) {
        counts[x.Base] = (counts[x.Base] || 0) + 1;
      });

      this.payData.forEach(x => {
        const y = x.Base / 1000;
        let pointColor = (y > (this.pricingData.Pay90)) || (y < (this.pricingData.Pay10)) ? '#C3C3CA' : '#FFFFFF';
        if (this.companyEmployeeId === x.CompanyEmployeeId) {
          pointColor = '#23CAEF';
        }
        scatterData.push(JobPricingGraphService.formatScatterData(x, this.pricingData, counts[x.Base], this.userLocale, y, pointColor));
      });
    }
    super.updateChartData(scatterData, payDataValues, this.chartRef);
  }
}

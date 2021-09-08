import { Component, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';

import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';
import { EmployeesPayModel } from 'libs/models/payfactors-api/company/response';
import { AsyncStateObj } from 'libs/models/state';

import { PricingGraphTypeEnum } from '../../models/pricing-graph-type.enum';
import { JobPricingGraphService } from '../../services/job-pricing-graph.service';
import * as fromJobPricingGraphReducer from '../../reducers';
import * as fromJobPricingGraphActions from '../../actions';
import { AbstractJobPricingGraphDirective } from '../common/abstract-job-pricing-graph.directive';

@Component({
  selector: 'pf-job-pricing-tcc-graph',
  templateUrl: '../common/job-pricing-graph.component.html',
  styleUrls: ['./job-pricing-tcc-graph.component.scss', '../../styles/graph-styles.scss']
})
export class JobPricingTccGraphComponent extends AbstractJobPricingGraphDirective implements OnInit, OnDestroy {

  constructor(
    private store: Store<fromJobPricingGraphReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
    super(store);
  }

  dataUpdatedSubscription: Subscription;
  payDataSuccessSubscription: Subscription;

  chartRef: Highcharts.Chart;
  graphType = PricingGraphTypeEnum.TCC;

  isValidPricingData: boolean;
  pricingData: PricingForPayGraph;
  payData: EmployeesPayModel[];

  pricingData$: Observable<AsyncStateObj<PricingForPayGraph>>;

  ngOnInit(): void {

    this.pricingData$ = this.store.select(fromJobPricingGraphReducer.getTCCPricing);

    this.payDataSuccessSubscription = this.actionsSubject.pipe(
      ofType(fromJobPricingGraphActions.LOAD_GRAPH_PAY_DATA_SUCCESS)
    ).subscribe((action: fromJobPricingGraphActions.LoadGraphPayDataSuccess) => {
      this.store.dispatch(new fromJobPricingGraphActions.GetTccPricingData(this.companyJobId, this.paymarketId, action.payData));
    });

    this.dataUpdatedSubscription = this.actionsSubject.pipe(
      ofType(fromJobPricingGraphActions.GET_TCC_PRICING_DATA_SUCCESS)
    ).subscribe((action: fromJobPricingGraphActions.GetTccPricingDataSuccess) => {
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
    const scatterData = [];
    const counts = {};
    let payDataValues = [];

    if (this.payData?.length) {
      payDataValues = this.payData.map(a => a.TCC / 1000);

      this.payData.forEach(function (x) {
        counts[x.TCC] = (counts[x.TCC] || 0) + 1;
      });

      this.payData.forEach(x => {
        const y = x.TCC / 1000;
        const pointColor = (y > (this.pricingData.Pay90)) || (y < (this.pricingData.Pay10)) ? '#C3C3CA' : '#FFFFFF';
        scatterData.push(JobPricingGraphService.formatScatterData(x, this.pricingData, counts[x.TCC], this.userLocale, y, pointColor));
      });
    }
    const payLabel = this.showPayLabel ? 'Total Cash' : null;
    super.updateChartData(scatterData, this.pricingData, payDataValues, this.isValidPricingData, this.graphType, payLabel, this.chartRef);
  }
}


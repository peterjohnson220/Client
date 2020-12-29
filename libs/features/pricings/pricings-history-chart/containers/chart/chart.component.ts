import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import Highcharts from 'highcharts';
import moment from 'moment';

import { PayMarketPricingHistory } from 'libs/models/payfactors-api';
import { AsyncStateObj } from 'libs/models';
import { annualDisplay, CompPipe, compRate } from 'libs/core';

import * as fromPricingHistoryChartReducer from '../../reducers';

@Component({
  selector: 'pf-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {

  readonly compPipe = new CompPipe(this.decimalPipe);

  Highcharts: typeof Highcharts = Highcharts;
  chartRef: Highcharts.Chart;
  chartOptions: Highcharts.Options = this.getChartOptions();
  updateFlag = false;

  getDataSubscription: Subscription;
  getFiltersSubscription: Subscription;

  chartData$: Observable<AsyncStateObj<PayMarketPricingHistory[]>>;

  rate: string = compRate.annual;

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  }

  constructor(private store: Store<fromPricingHistoryChartReducer.State>, private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {

    this.chartData$ = this.store.select(fromPricingHistoryChartReducer.getData);

    this.getDataSubscription = this.store.select(fromPricingHistoryChartReducer.getData)
      .subscribe(o => {
        this.updateChartData(o.obj);
      });

    this.getFiltersSubscription = this.store.select(fromPricingHistoryChartReducer.getFilters)
      .subscribe(o => {
        this.rate = o.Rate;
      });
  }

  updateChartData(data: PayMarketPricingHistory[]) {
    if (this.chartRef && data) {

      while (this.chartRef.series.length > 0) {
        this.chartRef.series[0].remove(true);
      }

      // Chart Date
      data.forEach(p => {
        const newSeries: any = {
          type: 'line',
          animation: false,
          name: p.PayMarketName,
          data: p.PricingData
        };
        this.chartRef.addSeries(newSeries, true);
      });

      // YAxis labels
      const compPipe = this.compPipe;
      const rate = this.rate;
      this.chartRef.yAxis[0].update(
        {
          labels: {
            formatter: function () {
              return compPipe.transform(this.value, rate, annualDisplay.truncatedRounded);
            }
          }
        }
      )

      this.chartRef.tooltip.update(
        {
          formatter: function () {
            return `<b>${this.series.name}</b>
            <br> <b>Pricing Date - </b>${moment(new Date(this.x)).format('MM/DD/YYYY')}
            <br> <b>Base MRP - </b>${compPipe.transform(this.y, rate, annualDisplay.truncatedRounded)}`;
          }
        }
      )

      this.updateFlag = true;
    }
  }

  getChartOptions(): Highcharts.Options {
    return {
      chart: {
        animation: false,
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Base MRP'
        },
      },
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function () {
            let dateFormatter = '%Y';
            let startDate = moment(new Date(this.axis.min));
            let endDate = moment(new Date(this.axis.max));
            if (moment.duration(endDate.diff(startDate)).asMonths() <= 4) {
              dateFormatter = `%b %Y`;
            }
            else if (moment.duration(moment(endDate).diff(moment(startDate))).asYears() <= 2) {
              dateFormatter = `Q${moment.utc(new Date(this.value)).quarter()} %Y`;
            }
            return Highcharts.dateFormat(dateFormatter, this.value);
          },
        },
        tickPositioner: function () {
          let positions = this.tickPositions;
          let startDate = moment(new Date(this.min));
          let endDate = moment(new Date(this.max));
          if (moment.duration(endDate.diff(startDate)).asYears() > 2) {
            positions = [];

            const curDate = moment(new Date(this.min)).startOf('year');
            const endDate = moment(new Date(this.max));

            while (curDate < endDate) {
              positions.push(curDate.toDate().getTime());
              curDate.add(1, 'y');
            }
          } else if (moment.duration(endDate.diff(startDate)).asMonths() > 4) {
            positions = [];
            const curDate = moment(new Date(this.min)).startOf('month');
            const endDate = moment(new Date(this.max));

            while (curDate < endDate) {
              positions.push(curDate.toDate().getTime());
              curDate.add(3, 'M');
            }
          }

          return positions;
        }
      },
      legend: {
        useHTML: true,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        floating: false,
        borderWidth: 1
      }
    };
  }

  ngOnDestroy() {
    this.getDataSubscription.unsubscribe();
    this.getFiltersSubscription.unsubscribe();
  }

}

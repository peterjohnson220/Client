import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import Highcharts from 'highcharts';
import {
  format,
  Interval,
  getQuarter,
  intervalToDuration,
  setMonth,
  setDate,
  addYears,
  addMonths
} from 'date-fns';

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
      );

      this.chartRef.tooltip.update(
        {
          formatter: function () {
            return `<b>${this.series.name}</b>
            <br> <b>Pricing Date - </b>${format(new Date(this.x), 'MM/DD/YYYY')}
            <br> <b>Base MRP - </b>${compPipe.transform(this.y, rate, annualDisplay.truncatedRounded)}`;
          }
        }
      );

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
            const startDate = new Date(this.axis.min);
            const endDate = new Date(this.axis.max);
            const fnsInterval: Interval = {
              start: startDate,
              end: endDate
            };
            const duration = intervalToDuration(fnsInterval);
            if (duration.months <= 4) {
              dateFormatter = `%b %Y`;
            } else if (duration.years <= 2) {
              dateFormatter = `Q${getQuarter(new Date(this.value))} %Y`;
            }
            return Highcharts.dateFormat(dateFormatter, this.value);
          },
        },
        tickPositioner: function () {
          let positions = this.tickPositions;
          const startDate = new Date(this.min);
          const endDate = new Date(this.max);
          const interval: Interval = {
            start: startDate,
            end: endDate
          };
          const duration = intervalToDuration(interval);

          if (duration.years > 2) {
            positions = [];

            const curDate = setMonth(setDate(new Date(this.min), 1), 1);
            const durationEnd = new Date(this.max);

            while (curDate < durationEnd) {
              positions.push(curDate.getTime());
              addYears(curDate, 1);
            }
          } else if (duration.months > 4) {
            positions = [];
            const curDate = setDate(new Date(this.min), 1);
            const end = new Date(this.max);

            while (curDate < end) {
              positions.push(curDate.getTime());
              addMonths(curDate, 3);
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

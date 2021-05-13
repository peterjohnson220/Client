import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import Highcharts from 'highcharts';
import {
  format,
  getQuarter,
  setMonth,
  setDate,
  addMonths,
  startOfDay,
  differenceInMonths
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
      const chart = this.chartRef;
      const chartCmp = this;
      this.chartRef.yAxis[0].update(
        {
          labels: {
            formatter: function () {
              const rangeData = chart.yAxis[0].getExtremes();
              const displayFormat = chartCmp.isSmallDataRange(rangeData) ?
                annualDisplay.truncated :
                annualDisplay.truncatedRounded;
              return compPipe.transform(this.value, rate, displayFormat);
            }
          }
        }
      );

      this.chartRef.tooltip.update(
        {
          formatter: function () {
            const date = new Date(this.x);
            const offset = date.getTimezoneOffset();
            const utcDate = format(new Date(date.setMinutes(offset)), 'MM/dd/yyyy')
            return `<b>${this.series.name}</b>
            <br> <b>Pricing Date: </b>${utcDate}</b>
            <br> <b>Base MRP: </b>${compPipe.transform(this.y, rate)}`;
          }
        }
      );

      this.updateFlag = true;
    }
  }

  getChartOptions(): Highcharts.Options {

    const chartCmp = this;

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
        tickPositioner: function() {
          const dataExtremes = this.getExtremes();
          let positions = this.tickPositions;
          if (chartCmp.isSmallDataRange(dataExtremes)) {
            positions = chartCmp.updateYAxisTickPositions(dataExtremes.dataMin, dataExtremes.dataMax);
          }
          return positions;
        }
      },
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function () {
            let dateFormatter = '%Y';
            const startDate = setDate(startOfDay(new Date(this.axis.min)), 1);
            const endDate = setDate(startOfDay(new Date(this.axis.max)), 1);
            const differenceMonths = differenceInMonths(endDate, startDate);
            if (differenceMonths <= 4) {
              dateFormatter = `%b %Y`;
            } else if (differenceMonths <= 24) {
              dateFormatter = `Q${getQuarter(new Date(this.value))} %Y`;
            }
            return Highcharts.dateFormat(dateFormatter, this.value);
          },
        },
        tickPositioner: function () {
          let positions = this.tickPositions;

          if (this.max && this.min && this.max !== this.min) {
            const startDate = setDate(startOfDay(new Date(this.min)), 1);
            const endDate = setDate(startOfDay(new Date(this.max)), 1);
            const differenceMonths = differenceInMonths(endDate, startDate);

            if (differenceMonths > 24) {
              positions = chartCmp.updateXAxisTickPositions(setMonth(startDate, 1), endDate, 12);
            } else if (differenceMonths > 4) {
              positions = chartCmp.updateXAxisTickPositions(startDate, endDate, 3);
            } else {
              positions = chartCmp.updateXAxisTickPositions(startDate, endDate, 1);
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

  updateXAxisTickPositions(start: Date, end: Date, increment: number) {
    const positions = [];
    let curDate = start;

    while (curDate <= end) {
      positions.push(curDate.getTime());
      curDate = addMonths(curDate, increment);
    }
    return positions;
  }

  updateYAxisTickPositions(min: number, max: number) {
    const positions = [];
    let tracker = min;
    const range = max - min;
    let interval = 100;

    switch (true) {
      case range > 2000:
        interval = 500;
        break;
      case range > 1000:
        interval = 250;
        break;
      default:
        interval = 100;
    }

    while (tracker <= (max + interval)) {
      positions.push(tracker);
      tracker += interval;
    }
    return positions;
  }

  isSmallDataRange(dataExtremes: Highcharts.ExtremesObject): boolean {
    return dataExtremes.dataMin && dataExtremes.dataMax &&
      dataExtremes.dataMax !== dataExtremes.dataMin && this.rate === compRate.annual &&
      dataExtremes.dataMax - dataExtremes.dataMin < 3000;
  }

}

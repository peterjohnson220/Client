import { DecimalPipe } from '@angular/common';

import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';
import { getUserLocale } from 'get-user-locale';

import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';
import { RateType } from 'libs/data/data-sets';
import { RangeGraphHelper } from 'libs/core/helpers';

import { EmployeeSalaryRangeChartConfig, EmployeeSalaryRangeChartData } from './salary-range-chart-config.model';

export class EmployeeSalaryRangeChartHelper {
  private static decimalPipe: DecimalPipe = new DecimalPipe(getUserLocale());
  private static labelYPosition = -30;

  static buildChartData(baseEntity: string, rangeTypeId: number, gridResult: any): EmployeeSalaryRangeChartData {
    const firstName = gridResult['CompanyEmployees_First_Name'] ?? '';
    const lastName = gridResult['CompanyEmployees_Last_Name'] ?? '';
    const employeeId = gridResult['CompanyEmployees_Employee_ID'] ?? '';
    const employeeNameAndId = firstName === '' && lastName === ''
      ? `Employee ID ${employeeId}`
      : `${firstName} ${lastName} (${employeeId})`;
    const currencySourceName = EmployeeSalaryRangeChartConfig.getCurrencySourceNameByRangeType(rangeTypeId);
    const positionInRangeSourceName = EmployeeSalaryRangeChartConfig.getPositionInRangeSourceNameByRangeType(rangeTypeId);
    const rangeDistributionTypeSourceName = EmployeeSalaryRangeChartConfig.getRangeDistributionTypeSourceNameByRangeType(rangeTypeId);
    const rate = gridResult[`${EmployeeSalaryRangeChartConfig.getRateByRangeType(rangeTypeId)}`];
    const min = gridResult[`${baseEntity}_Min`];
    const max = gridResult[`${baseEntity}_Max`];
    return {
      RangeDistributionTypeId: gridResult[`${rangeDistributionTypeSourceName}`],
      EmployeeId: employeeId,
      FullName: `${firstName} ${lastName}`,
      ChartEmployeeNameAndId: employeeNameAndId,
      BaseSalary: gridResult['CompanyEmployees_Base'] ?? 0,
      Currency: gridResult[`${currencySourceName}`],
      PositionInRange: gridResult[`${positionInRangeSourceName}`],
      Rate: rate,
      Min: min,
      Mid: gridResult[`${baseEntity}_Mid`],
      Max: max,
      TertileFirst: gridResult[`${baseEntity}_Tertile_First`],
      TertileSecond: gridResult[`${baseEntity}_Tertile_Second`],
      QuartileFirst: gridResult[`${baseEntity}_Quartile_First`],
      QuartileSecond: gridResult[`${baseEntity}_Quartile_Second`],
      QuintileFirst: gridResult[`${baseEntity}_Quintile_First`],
      QuintileSecond: gridResult[`${baseEntity}_Quintile_Second`],
      QuintileThird: gridResult[`${baseEntity}_Quintile_Third`],
      QuintileFourth: gridResult[`${baseEntity}_Quintile_Fourth`]
    };
  }

  static get chartColors(): string[] {
    return ['#41265C', '#7243A2', '#9E76C6', '#B393D2', '#CCB7E1'];
  }

  static getChartOptions(chartData: EmployeeSalaryRangeChartData): Highcharts.Options {
    const employeePositionValue = this.getScatterDataCustomYValue(chartData.BaseSalary, chartData.Min, chartData.Max);
    return {
      chart: {
        inverted: true,
        animation: false,
        type: 'bullet',
        height: 170,
        spacingTop: 50
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      legend: {
        align: 'left',
        backgroundColor: '#F6F7F8',
        itemStyle: {
          fontWeight: 'normal'
        }
      },
      plotOptions: {
        series: {
          animation: false,
          stickyTracking: false
        },
        bullet: {
          showInLegend: false
        }
      },
      title: { text: null },
      tooltip: {
        backgroundColor: '#000000',
        borderColor: '#000000',
        style: {
          color: '#ffffff'
        },
        formatter: (data) => {
          const positionInRange = chartData.PositionInRange !== null
            ? `<br/>Position in Range: ${chartData.PositionInRange}%`
            : '';
          return `${chartData.ChartEmployeeNameAndId} ${positionInRange}`;
        }
      },
      xAxis: {
        categories: [''],
        gridLineWidth: 0,
        lineWidth: 0,
        labels: {
          enabled: false
        }
      },
      yAxis: {
        gridLineWidth: 0,
        title: null,
        plotBands: chartData.PlotBands,
        min: this.getChartMin(chartData),
        max: this.getChartMax(chartData),
        tickInterval: this.getTickInterval(chartData.Min, chartData.Max),
        tickPositioner: function () {
          return chartData.ChartTickPositions;
        },
        labels: {
          formatter: function() {
            if (employeePositionValue === this.value) {
              return '';
            }
            return EmployeeSalaryRangeChartHelper.formatYAxisLabel(this.value, chartData.Rate);
          }
        }
      },
      series: [this.getBulletSerries(chartData), this.getScatterSeries(chartData)]
    };
  }

  static getBulletSerries(chartData: EmployeeSalaryRangeChartData): Highcharts.SeriesBulletOptions {
    return {
      type: 'bullet',
      pointWidth: 0,
      color: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      data: [{
        y: this.getScatterDataCustomYValue(chartData.BaseSalary, chartData.Min, chartData.Max),
        target: this.getScatterDataCustomYValue(chartData.BaseSalary, chartData.Min, chartData.Max)
      }]
    };
  }

  static getScatterSeries(chartData: EmployeeSalaryRangeChartData): Highcharts.SeriesScatterOptions {
    return {
      type: 'scatter',
      name: 'Employee Position',
      color: '#23CAEF',
      data: [{
        x: 0,
        y: this.getScatterDataCustomYValue(chartData.BaseSalary, chartData.Min, chartData.Max)
      }],
      marker: {
        radius: 6
      }
    };
  }

  static getChartMin(chartData: EmployeeSalaryRangeChartData): number {
    const tickInterval = this.getTickInterval(chartData.Min, chartData.Max);
    return chartData.BaseSalary < chartData.Min
      ? chartData.Min - tickInterval
      : chartData.Min;
  }

  static getChartMax(chartData: EmployeeSalaryRangeChartData): number {
    const tickInterval = this.getTickInterval(chartData.Min, chartData.Max);
    return chartData.BaseSalary > chartData.Max
      ? chartData.Max + tickInterval
      : chartData.Max;
  }

  static getScatterDataCustomYValue(scatterDataValue: number, min: number, max: number): number {
    const tickInterval = this.getTickInterval(min, max);
    const yValue = scatterDataValue >= min && scatterDataValue <= max
      ? scatterDataValue
      : scatterDataValue < min
        ? min - tickInterval
        : max + tickInterval;
    return yValue;
  }

  static getTickInterval(min: number, max: number): number {
    if (min === null || max === null) {
      return 0;
    }
    const distance = max - min;
    if (distance >= 1000) {
      return 1000;
    }
    if (distance >= 100) {
      return 100;
    }
    if (distance >= 10) {
      return 10;
    }
    return 1;
  }

  static formatYAxisLabel(value: number, rate = RateType.Annual): string {
    const rawLabelValue = value < 1000 ? value : value / 1000.0;
    const decimals = rate === RateType.Annual ? '1.1-1' : '1.2-2';
    const formattedValue = this.decimalPipe.transform(rawLabelValue || 0, decimals);
    return formattedValue;
  }

  static updateChartDataByRangeDistributionType(chartData: EmployeeSalaryRangeChartData, rangeDistributionTypeId: number): void {
    switch (rangeDistributionTypeId) {
      case RangeDistributionTypeIds.Tertile: {
        chartData.PlotBands = this.getTertileYAxisPlotBands(chartData);
        break;
      }
      case RangeDistributionTypeIds.Quartile: {
        chartData.PlotBands = this.getQuartileYAxisPlotBands(chartData);
        break;
      }
      case RangeDistributionTypeIds.Quintile: {
        chartData.PlotBands = this.getQuintileYAxisPlotBands(chartData);
        break;
      }
      default: {
        chartData.PlotBands = this.getMinMidMaxYAxisPlotBands(chartData);
        break;
      }
    }
    const employeePosition = this.getScatterDataCustomYValue(chartData.BaseSalary, chartData.Min, chartData.Max);
    const positions = [employeePosition, chartData.Min, chartData.Max];
    positions.sort(function(a, b) {
      return a - b;
    });
    chartData.ChartTickPositions = positions;
  }

  static getMinMidMaxYAxisPlotBands(chartData: EmployeeSalaryRangeChartData): YAxisPlotBandsOptions[] {
    return [
      {
        from: chartData.Min,
        to: chartData.Mid,
        color: this.chartColors[0],
        label: {
          text: 'Minimum',
          verticalAlign: 'top',
          align: 'left',
          y: this.labelYPosition
        }
      },
      {
        from: chartData.Mid,
        to: chartData.Max,
        color: this.chartColors[1],
        label: {
          text: 'Maximum',
          verticalAlign: 'top',
          align: 'right',
          y: this.labelYPosition
        }
      }
    ];
  }

  static getTertileYAxisPlotBands(chartData: EmployeeSalaryRangeChartData): YAxisPlotBandsOptions[] {
    return [
      {
        from: chartData.Min,
        to: chartData.TertileFirst,
        color: this.chartColors[0],
        label: {
          text: 'Minimum',
          verticalAlign: 'top',
          align: 'left',
          y: this.labelYPosition
        }
      },
      {
        from: chartData.TertileFirst,
        to: chartData.TertileSecond,
        color: this.chartColors[1]
      },
      {
        from: chartData.TertileSecond,
        to: chartData.Max,
        color: this.chartColors[2],
        label: {
          text: 'Maximum',
          verticalAlign: 'top',
          align: 'right',
          y: this.labelYPosition
        }
      }
    ];
  }

  static getQuartileYAxisPlotBands(chartData: EmployeeSalaryRangeChartData): YAxisPlotBandsOptions[] {
    return [
      {
        from: chartData.Min,
        to: chartData.QuartileFirst,
        color: this.chartColors[0],
        label: {
          text: 'Minimum',
          verticalAlign: 'top',
          align: 'left',
          y: this.labelYPosition
        }
      },
      {
        from: chartData.QuartileFirst,
        to: chartData.Mid,
        color: this.chartColors[1]
      },
      {
        from: chartData.Mid,
        to: chartData.QuartileSecond,
        color: this.chartColors[2]
      },
      {
        from: chartData.QuartileSecond,
        to: chartData.Max,
        color: this.chartColors[3],
        label: {
          text: 'Maximum',
          verticalAlign: 'top',
          align: 'right',
          y: this.labelYPosition
        }
      }
    ];
  }

  static getQuintileYAxisPlotBands(chartData: EmployeeSalaryRangeChartData): YAxisPlotBandsOptions[] {
    return [
      {
        from: chartData.Min,
        to: chartData.QuintileFirst,
        color: this.chartColors[0],
        label: {
          text: 'Minimum',
          verticalAlign: 'top',
          align: 'left',
          y: this.labelYPosition
        }
      },
      {
        from: chartData.QuintileFirst,
        to: chartData.QuintileSecond,
        color: this.chartColors[1]
      },
      {
        from: chartData.QuintileSecond,
        to: chartData.QuintileThird,
        color: this.chartColors[2]
      },
      {
        from: chartData.QuintileThird,
        to: chartData.QuintileFourth,
        color: this.chartColors[3]
      },
      {
        from: chartData.QuintileFourth,
        to: chartData.Max,
        color: this.chartColors[4],
        label: {
          text: 'Maximum',
          verticalAlign: 'top',
          align: 'right',
          y: this.labelYPosition
        }
      }
    ];
  }
}

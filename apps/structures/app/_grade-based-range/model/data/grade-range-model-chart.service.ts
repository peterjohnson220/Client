import { RangeDistributionTypeIds } from '../../../shared/constants/range-distribution-type-ids';


export class GradeRangeModelChartService {
  static getCategoryLabels(distributionType) {
    let categories = [];
    switch (distributionType) {
      case RangeDistributionTypeIds.MinMidMax:
      case RangeDistributionTypeIds.Quartile:
        categories = ['Below Min', 'First Quartile', 'Second Quartile', 'Third Quartile', 'Fourth Quartile', 'Above Max'];
        break;
      case RangeDistributionTypeIds.Tertile:
        categories = ['Below Min', 'First Tertile', 'Second Tertile', 'Third Tertile', 'Above Max'];
        break;
      case RangeDistributionTypeIds.Quintile:
        categories = ['Below Min', 'First Quintile', 'Second Quintile', 'Third Quintile', 'Fourth Quintile', 'Fifth Quintile', 'Above Max'];
        break;
    }
    return categories;
  }

  static getHeatmapOptions(distributionType) {
    return {

      chart: {
        height: 163
      },

      xAxis: {
        categories: this.getCategoryLabels(distributionType),
        opposite: true,
        labels: {
          style: {
            fontWeight: 'bold',
            color: 'black'
          }
        }
      },

      yAxis: {
        title: null,
        labels: {
          enabled: false
        }
      },

      credits: {
        enabled: false
      },
      title: {
        text: undefined
      },
      legend: {
        backgroundColor: '#E9EAED',
        floating: false,
        verticalAlign: 'bottom',
        align: 'right'
      },

      colorAxis: {
        showInLegend: false,
        dataClasses: [{
          to: 20,
          color: '#FFFFFF'
        }, {
          from: 21,
          to: 40,
          color: '#FFD470'
        }, {
          from: 41,
          to: 60,
          color: '#FFB300'
        }, {
          from: 61,
          to: 80,
          color: '#B37D00'
        }, {
          from: 81,
          to: 100,
          color: '#6B4B00'
        }],
        min: 0,
        max: 100
      },
      series: [{
        type: 'heatmap',
        showInLegend: false,
        borderWidth: 0.5
      },
      {
        name: '0-20%',
        type: 'scatter',
        color: '#FFFFFF',
        marker: {
          symbol: 'square',
          radius: 12
        }
      },
      {
        name: '21-40%',
        type: 'scatter',
        color: '#FFD470',
        marker: {
          symbol: 'square',
          radius: 12
        }
      },
      {
        name: '41-60%',
        type: 'scatter',
        color: '#FFB300',
        marker: {
          symbol: 'square',
          radius: 12
        }
      },
      {
        name: '61-80%',
        type: 'scatter',
        color: '#B37D00',
        marker: {
          symbol: 'square',
          radius: 12
        }
      },
      {
        name: '81-100%',
        type: 'scatter',
        color: '#6B4B00',
        marker: {
          symbol: 'square',
          radius: 12
        }
      }],

      tooltip: {
        enabled: false
      },

      plotOptions: {
        series: {
          states: {
            hover: {
              enabled: false
            }
          }
        }
      },

      responsive: {
        rules: [{
          condition: {
            maxWidth: 200
          }
        }]
      }

    };
  }
}

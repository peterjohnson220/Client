import * as Highcharts from 'highcharts';
import { RateType } from 'libs/data/data-sets';
import { RangeGroupMetadata } from '../models';
import { RangeDistributionDataPointTypeIds } from '../constants/range-distribution-data-point-type-ids';
import { RangeDistributionTypeIds } from '../constants/range-distribution-type-ids';

export class StructuresHighchartsService {

  static initializeHighcharts() {
    require('highcharts/highcharts-more')(Highcharts);

    // this is the basic line symbol that is currently used to allow a scatter plot to use lines instead of dots.
    Highcharts.SVGRenderer.prototype.symbols.vline =
      function (x, y, width, height) {
        return ['M', x, y + width / 2, 'L', x + height, y + width / 2];
      };
  }

  static formatCurrency(rawCurrency, locale, currencyCode, rate, useGrouping?) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: rate === RateType.Hourly ? 2 : 0,
      maximumFractionDigits: rate === RateType.Hourly ? 2 : 0,
      useGrouping: useGrouping
    });

    return formatter.format(rawCurrency);
  }

  static formatColumnRange(xCoordinate, low, high) {
    return {x: xCoordinate, low: low, high: high};
  }

  static formatYAxisLabel(value, locale, currencyCode, rate) {
    const rawLabelValue = rate === RateType.Hourly ? value : value / 1000;
    const formattedValue = StructuresHighchartsService.formatCurrency(rawLabelValue, locale, currencyCode, rate, false);
    return formattedValue + (rate === RateType.Hourly ? '' : 'k');
  }

  static formatCurrentDataPoint(hasCurrentStructure, dataPointType, value, chartLocale, md: RangeGroupMetadata) {
    return md.IsCurrent || hasCurrentStructure ?
      StructuresHighchartsService.formatDataPoint(dataPointType, value, chartLocale, md.Currency, md.Rate) : null;
  }

  static formatNewDataPoint(hasCurrentStructure, dataPointType, value, chartLocale, md: RangeGroupMetadata) {
    return !md.IsCurrent && !hasCurrentStructure ?
      StructuresHighchartsService.formatDataPoint(dataPointType, value, chartLocale, md.Currency, md.Rate) : null;
  }

  static formatDataPointDelta(hasCurrentStructure, chartLocale, md: RangeGroupMetadata, dataPoint, currentDataPoint) {
    return md.IsCurrent === false && !hasCurrentStructure
      ? StructuresHighchartsService.formatDeltaInDataPointForExistingStruct(dataPoint, currentDataPoint, chartLocale, md.Currency, md.Rate)
      : null;
  }

  static formatDataPoint(dataPointType, value, locale, currency, rate) {
    return !!value ? `${dataPointType}: ${StructuresHighchartsService.formatCurrency(value, locale, currency, rate)}` : null;
  }

  static formatDeltaInDataPointForExistingStruct(newValue, currentValue, locale, currency, rate) {
    if (!!newValue && !!currentValue) {
      if (Math.round(newValue) > Math.round(currentValue)) {
        const percentChange = Math.round(((newValue - currentValue) / currentValue) * 100);
        return {
          message: `${StructuresHighchartsService.formatCurrency(newValue - currentValue, locale, currency, rate)}
              (${percentChange}%) increase`,
          icon: '&#8593;',
          color: '#6DD400'
        };
      } else if (Math.round(newValue) < Math.round(currentValue)) {
        const percentChange = Math.round(((currentValue - newValue) / currentValue) * 100);
        return {
          message: `${StructuresHighchartsService.formatCurrency(currentValue - newValue, locale, currency, rate)}
            (${percentChange}%) decrease`,
          icon: '&#8595;',
          color: 'red'
        };
      }
    }
    return null;
  }

  static getDataPoint(xCoordinate, dataPointTypeId, jobRangeData, hasCurrentStructure, chartLocale, metaData) {
    let dataPointValue;
    let dataPointCurrentValue;
    let dataPointTitle;
    let currentDataPointTitle;
    let newDataPointTitle;

    if (dataPointTypeId === RangeDistributionDataPointTypeIds.Mid) {
      dataPointValue = jobRangeData.CompanyStructures_Ranges_Mid;
      dataPointCurrentValue = jobRangeData.CompanyStructures_RangeGroup_CurrentStructureMidPoint;
      dataPointTitle = 'Midpoint';
      currentDataPointTitle = 'Current Mid';
      newDataPointTitle = 'New Mid';
    } else if (dataPointTypeId === RangeDistributionDataPointTypeIds.TertileFirst) {
      dataPointValue = jobRangeData.CompanyStructures_Ranges_Tertile_First;
      dataPointCurrentValue = jobRangeData.CompanyStructures_Ranges_Tertile_CurrentFirst;
      dataPointTitle = 'Top 1st 3rd';
      currentDataPointTitle = 'Current Top 1st 3rd';
      newDataPointTitle = 'New Top 1st 3rd';
    } else if (dataPointTypeId === RangeDistributionDataPointTypeIds.TertileSecond) {
      dataPointValue = jobRangeData.CompanyStructures_Ranges_Tertile_Second;
      dataPointCurrentValue = jobRangeData.CompanyStructures_Ranges_Tertile_CurrentSecond;
      dataPointTitle = 'Top 2nd 3rd';
      currentDataPointTitle = 'Current Top 2nd 3rd';
      newDataPointTitle = 'New Top 2nd 3rd';
    } else if (dataPointTypeId === RangeDistributionDataPointTypeIds.QuartileFirst) {
      dataPointValue = jobRangeData.CompanyStructures_Ranges_Quartile_First;
      dataPointCurrentValue = jobRangeData.CompanyStructures_Ranges_Quartile_CurrentFirst;
      dataPointTitle = 'Top 1st 4th';
      currentDataPointTitle = 'Current Top 1st 4th';
      newDataPointTitle = 'New Top 1st 4th';
    } else if (dataPointTypeId === RangeDistributionDataPointTypeIds.QuartileSecond) {
      dataPointValue = jobRangeData.CompanyStructures_Ranges_Quartile_Second;
      dataPointCurrentValue = jobRangeData.CompanyStructures_Ranges_Quartile_CurrentSecond;
      dataPointTitle = 'Top 3rd 4th';
      currentDataPointTitle = 'Current Top 3rd 4th';
      newDataPointTitle = 'New Top 3rd 4th';
    } else if (dataPointTypeId === RangeDistributionDataPointTypeIds.QuintileFirst) {
      dataPointValue = jobRangeData.CompanyStructures_Ranges_Quintile_First;
      dataPointCurrentValue = jobRangeData.CompanyStructures_Ranges_Quintile_CurrentFirst;
      dataPointTitle = 'Top 1st 5th';
      currentDataPointTitle = 'Current Top 1st 5th';
      newDataPointTitle = 'New Top 1st 5th';
    } else if (dataPointTypeId === RangeDistributionDataPointTypeIds.QuintileSecond) {
      dataPointValue = jobRangeData.CompanyStructures_Ranges_Quintile_Second;
      dataPointCurrentValue = jobRangeData.CompanyStructures_Ranges_Quintile_CurrentSecond;
      dataPointTitle = 'Top 2nd 5th';
      currentDataPointTitle = 'Current Top 2nd 5th';
      newDataPointTitle = 'New Top 2nd 5th';
    } else if (dataPointTypeId === RangeDistributionDataPointTypeIds.QuintileThird) {
      dataPointValue = jobRangeData.CompanyStructures_Ranges_Quintile_Third;
      dataPointCurrentValue = jobRangeData.CompanyStructures_Ranges_Quintile_CurrentThird;
      dataPointTitle = 'Top 3rd 5th';
      currentDataPointTitle = 'Current Top 3rd 5th';
      newDataPointTitle = 'New Top 3rd 5th';
    } else if (dataPointTypeId === RangeDistributionDataPointTypeIds.QuintileFourth) {
      dataPointValue = jobRangeData.CompanyStructures_Ranges_Quintile_Fourth;
      dataPointCurrentValue = jobRangeData.CompanyStructures_Ranges_Quintile_CurrentFourth;
      dataPointTitle = 'Top 4th 5th';
      currentDataPointTitle = 'Current Top 4th 5th';
      newDataPointTitle = 'New Top 4th 5th';
    }


    const delta = StructuresHighchartsService.formatDataPointDelta(hasCurrentStructure, chartLocale, metaData, dataPointValue, dataPointCurrentValue);
    return {
      x: xCoordinate,
      y: dataPointValue,
      jobTitle: jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(hasCurrentStructure, dataPointTitle, dataPointValue, chartLocale, metaData),
      currentDataPoint:
        StructuresHighchartsService.formatNewDataPoint(hasCurrentStructure, currentDataPointTitle, dataPointCurrentValue, chartLocale, metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(hasCurrentStructure, newDataPointTitle, dataPointValue, chartLocale, metaData),
      delta: !!delta ? delta.message : delta,
      icon: !!delta ? delta.icon : delta,
      iconColor: !!delta ? delta.color : delta
    };
  }

  static getChartMin(jobRangeData, rangeDistributionTypeId) {
      let comparisonValue = jobRangeData.CompanyStructures_Ranges_Min == null ? 0 : jobRangeData.CompanyStructures_Ranges_Min;

    // Tertile - Quartile - Quintile
    if (rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      if (!!jobRangeData.CompanyStructures_Ranges_Tertile_First && jobRangeData.CompanyStructures_Ranges_Tertile_First < comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Tertile_First;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Tertile_Second && jobRangeData.CompanyStructures_Ranges_Tertile_Second < comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Tertile_Second;
      }
    } else if (rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      if (!!jobRangeData.CompanyStructures_Ranges_Quartile_First
        && jobRangeData.CompanyStructures_Ranges_Quartile_First < comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quartile_First;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Quartile_Second
        && jobRangeData.CompanyStructures_Ranges_Quartile_Second < comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quartile_Second;
      }
    } else if (rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      if (!!jobRangeData.CompanyStructures_Ranges_Quintile_First
        && jobRangeData.CompanyStructures_Ranges_Quintile_First < comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quintile_First;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Quintile_Second
        && jobRangeData.CompanyStructures_Ranges_Quintile_Second < comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quintile_Second;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Quintile_Third
        && jobRangeData.CompanyStructures_Ranges_Quintile_Third < comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quintile_Third;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Quintile_Fourth
        && jobRangeData.CompanyStructures_Ranges_Quintile_Fourth < comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quintile_Fourth;
      }
    }

    return comparisonValue;
  }


  static getChartMax(jobRangeData, rangeDistributionTypeId) {
    let comparisonValue = jobRangeData.CompanyStructures_Ranges_Max;

    // Tertile - Quartile - Quintile
    if (rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      if (!!jobRangeData.CompanyStructures_Ranges_Tertile_First && jobRangeData.CompanyStructures_Ranges_Tertile_First > comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Tertile_First;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Tertile_Second && jobRangeData.CompanyStructures_Ranges_Tertile_Second > comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Tertile_Second;
      }
    } else if (rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      if (!!jobRangeData.CompanyStructures_Ranges_Quartile_First
        && jobRangeData.CompanyStructures_Ranges_Quartile_First > comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quartile_First;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Quartile_Second
        && jobRangeData.CompanyStructures_Ranges_Quartile_Second > comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quartile_Second;
      }
    } else if (rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      if (!!jobRangeData.CompanyStructures_Ranges_Quintile_First
        && jobRangeData.CompanyStructures_Ranges_Quintile_First > comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quintile_First;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Quintile_Second
        && jobRangeData.CompanyStructures_Ranges_Quintile_Second > comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quintile_Second;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Quintile_Third
        && jobRangeData.CompanyStructures_Ranges_Quintile_Third > comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quintile_Third;
      }

      if (!!jobRangeData.CompanyStructures_Ranges_Quintile_Fourth
        && jobRangeData.CompanyStructures_Ranges_Quintile_Fourth > comparisonValue) {
        comparisonValue = jobRangeData.CompanyStructures_Ranges_Quintile_Fourth;
      }
    }

    return comparisonValue;
  }
}

import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';
import { RangeType } from 'libs/constants/structures/range-type';

import { StructuresHighchartsService } from '../../../shared/services';
import { RangeDistributionDataPointTypeIds } from '../../../shared/constants/range-distribution-data-point-type-ids';

export class SingleJobViewHighchartsService {

  static getChartMin(jobRangeData, rangeDistributionTypeId) {
    let comparisonValue = jobRangeData.CompanyJobs_Structures_Min == null ? 0 : jobRangeData.CompanyJobs_Structures_Min;

    // Tertile - Quartile - Quintile
    if (rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      if (!!jobRangeData.CompanyJobs_Structures_Tertile_First && jobRangeData.CompanyJobs_Structures_Tertile_First < comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Tertile_First;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Tertile_Second && jobRangeData.CompanyJobs_Structures_Tertile_Second < comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Tertile_Second;
      }
    } else if (rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      if (!!jobRangeData.CompanyJobs_Structures_Quartile_First
        && jobRangeData.CompanyJobs_Structures_Quartile_First < comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quartile_First;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Quartile_Second
        && jobRangeData.CompanyJobs_Structures_Quartile_Second < comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quartile_Second;
      }
    } else if (rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      if (!!jobRangeData.CompanyJobs_Structures_Quintile_First
        && jobRangeData.CompanyJobs_Structures_Quintile_First < comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quintile_First;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Quintile_Second
        && jobRangeData.CompanyJobs_Structures_Quintile_Second < comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quintile_Second;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Quintile_Third
        && jobRangeData.CompanyJobs_Structures_Quintile_Third < comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quintile_Third;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Quintile_Fourth
        && jobRangeData.CompanyJobs_Structures_Quintile_Fourth < comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quintile_Fourth;
      }
    }

    return comparisonValue;
  }

  static getChartMax(jobRangeData, rangeDistributionTypeId) {
    let comparisonValue = jobRangeData.CompanyJobs_Structures_Max;

    // Tertile - Quartile - Quintile
    if (rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      if (!!jobRangeData.CompanyJobs_Structures_Tertile_First && jobRangeData.CompanyJobs_Structures_Tertile_First > comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Tertile_First;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Tertile_Second && jobRangeData.CompanyJobs_Structures_Tertile_Second > comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Tertile_Second;
      }
    } else if (rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      if (!!jobRangeData.CompanyJobs_Structures_Quartile_First
        && jobRangeData.CompanyJobs_Structures_Quartile_First > comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quartile_First;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Quartile_Second
        && jobRangeData.CompanyJobs_Structures_Quartile_Second > comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quartile_Second;
      }
    } else if (rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      if (!!jobRangeData.CompanyJobs_Structures_Quintile_First
        && jobRangeData.CompanyJobs_Structures_Quintile_First > comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quintile_First;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Quintile_Second
        && jobRangeData.CompanyJobs_Structures_Quintile_Second > comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quintile_Second;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Quintile_Third
        && jobRangeData.CompanyJobs_Structures_Quintile_Third > comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quintile_Third;
      }

      if (!!jobRangeData.CompanyJobs_Structures_Quintile_Fourth
        && jobRangeData.CompanyJobs_Structures_Quintile_Fourth > comparisonValue) {
        comparisonValue = jobRangeData.CompanyJobs_Structures_Quintile_Fourth;
      }
    }

    return comparisonValue;
  }

  static getDataPointForGBRJobs(xCoordinate, dataPointTypeId, jobRangeData, hasCurrentStructure, chartLocale, metaData) {
    let dataPointValue;
    let dataPointCurrentValue;
    let dataPointTitle;
    let currentDataPointTitle;
    let newDataPointTitle;
    let gradeName;
    let currentMid;

    if (dataPointTypeId === RangeDistributionDataPointTypeIds.Mid) {
      dataPointValue = jobRangeData.CompanyJobs_Structures_Mid;
      dataPointCurrentValue = jobRangeData.CompanyStructures_RangeGroup_GradeBased_Range_CurrentMid;
      dataPointTitle = 'Midpoint';
      currentDataPointTitle = 'Current Mid';
      newDataPointTitle = 'Model Mid';
    }
    // will need to add else ifs for dataPointTypeIds 2-9 like getDataPoint when instructed to do so

    gradeName = metaData.RangeTypeId === RangeType.Grade ? jobRangeData.CompanyJobs_Structures_Grade_Name : null;
    currentMid = metaData.RangeTypeId === RangeType.Grade ? jobRangeData.CompanyStructures_RangeGroup_GradeBased_Range_CurrentMid : null;
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
      iconColor: !!delta ? delta.color : delta,
      modeledMid: StructuresHighchartsService.formatDataPoint(metaData.IsCurrent ? 'Current Mid' : 'Modeled Mid', dataPointValue,
        chartLocale, metaData.Currency, metaData.Rate),
      gradeName: gradeName ? `Grade Name: ${gradeName}` : null,
      currentMid: StructuresHighchartsService.formatDataPoint('Current Mid', currentMid, chartLocale, metaData.Currency, metaData.Rate),
      midPointDiff: StructuresHighchartsService.getPercentDiff('Mid Percent Difference', currentMid, dataPointValue)
    };
  }
}


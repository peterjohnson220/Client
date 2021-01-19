import { RangeType } from 'libs/models/common';
import { GradeBasedPageViewIds, JobBasedPageViewIds } from 'libs/models/structures/page-view-ids';

export class PagesHelper {
  static getModelPageViewIdByRangeTypeAndRangeDistributionType(rangeType: number, rangeDistributionType: number): string {
    if (rangeType === RangeType.Grade) {
      switch (rangeDistributionType) {
        case 1:
          return GradeBasedPageViewIds.ModelMinMidMax;
        case 2:
          return GradeBasedPageViewIds.ModelTertile;
        case 3:
          return GradeBasedPageViewIds.ModelQuartile;
        case 4:
          return GradeBasedPageViewIds.ModelQuintile;
        default:
          return GradeBasedPageViewIds.ModelMinMidMax;
      }
    }

    if (rangeType === RangeType.Job) {
      switch (rangeDistributionType) {
        case 1:
          return JobBasedPageViewIds.ModelMinMidMax;
        case 2:
          return JobBasedPageViewIds.ModelTertile;
        case 3:
          return JobBasedPageViewIds.ModelQuartile;
        case 4:
          return JobBasedPageViewIds.ModelQuintile;
        default:
          return JobBasedPageViewIds.ModelMinMidMax;
      }
    }
  }

  static getModelSummaryPageViewIdByRangeDistributionType(rangeDistributionType: number): string {
    switch (rangeDistributionType) {
      case 1:
        return GradeBasedPageViewIds.ModelSummaryMinMidMax;
      case 2:
        return GradeBasedPageViewIds.ModelSummaryTertile;
      case 3:
        return GradeBasedPageViewIds.ModelSummaryQuartile;
      case 4:
        return GradeBasedPageViewIds.ModelSummaryQuintile;
      default:
        return GradeBasedPageViewIds.ModelSummaryMinMidMax;
    }
  }

  static getEmployeePageViewIdByRangeDistributionType(rangeDistributionType: number): string {
    switch (rangeDistributionType) {
      case 1:
        return JobBasedPageViewIds.EmployeesMinMidMax;
      case 2:
        return JobBasedPageViewIds.EmployeesTertile;
      case 3:
        return JobBasedPageViewIds.EmployeesQuartile;
      case 4:
        return JobBasedPageViewIds.EmployeesQuintile;
      default:
        return JobBasedPageViewIds.EmployeesMinMidMax;
    }
  }
}

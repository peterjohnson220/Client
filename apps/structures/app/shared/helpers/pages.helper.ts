import { GradeBasedPageViewIds, JobBasedPageViewIds } from 'libs/models/structures/page-view-ids';
import { RangeType } from 'libs/constants/structures/range-type';

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

  static getEmployeePageViewIdByRangeTypeAndRangeDistributionType(rangeType: number, rangeDistributionType: number): string {
    if (rangeType === RangeType.Grade) {
      switch (rangeDistributionType) {
        case 1:
          return GradeBasedPageViewIds.EmployeesMinMidMax;
        case 2:
          return GradeBasedPageViewIds.EmployeesTertile;
        case 3:
          return GradeBasedPageViewIds.EmployeesQuartile;
        case 4:
          return GradeBasedPageViewIds.EmployeesQuintile;
        default:
          return GradeBasedPageViewIds.EmployeesMinMidMax;
      }
    }

    if (rangeType === RangeType.Job) {
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

  static getJobsPageViewIdByRangeDistributionType(rangeDistributionType: number): string {
    switch (rangeDistributionType) {
      case 1:
        return GradeBasedPageViewIds.JobsMinMidMax;
      case 2:
        return GradeBasedPageViewIds.JobsTertile;
      case 3:
        return GradeBasedPageViewIds.JobsQuartile;
      case 4:
        return GradeBasedPageViewIds.JobsQuintile;
      default:
        return GradeBasedPageViewIds.JobsMinMidMax;
    }
  }
}

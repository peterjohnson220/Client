import { PageViewIds } from '../constants/page-view-ids';

export class PagesHelper {
  static getModelPageViewIdByRangeDistributionType(rangeDistributionType: number): string {
    switch (rangeDistributionType) {
      case 1:
        return PageViewIds.ModelMinMidMax;
      case 2:
        return PageViewIds.ModelTertile;
      case 3:
        return PageViewIds.ModelQuartile;
      case 4:
        return PageViewIds.ModelQuintile;
      default:
        return PageViewIds.ModelMinMidMax;
    }
  }

  static getEmployeePageViewIdByRangeDistributionType(rangeDistributionType: number): string {
    switch (rangeDistributionType) {
      case 1:
        return PageViewIds.EmployeesMinMidMax;
      case 2:
        return PageViewIds.EmployeesTertile;
      case 3:
        return PageViewIds.EmployeesQuartile;
      case 4:
        return PageViewIds.EmployeesQuintile;
      default:
        return PageViewIds.EmployeesMinMidMax;
    }
  }
}

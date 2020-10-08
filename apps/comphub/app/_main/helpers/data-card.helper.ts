import { SortOption } from 'libs/models/payfactors-api/comphub';

import { QuickPriceGridContext } from '../models';

export class DataCardHelper {
  static firstDayOfMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }

  static calculateDataByHourlyRate(annualValue: number): number {
    if (!annualValue) {
      return 0;
    }
    return annualValue / 2080;
  }

  static getSortOption(gridContext: QuickPriceGridContext): SortOption {
    if (gridContext.Sort) {
      // only allowing single sort
      return {
        Dir: gridContext.Sort.dir,
        Field: gridContext.Sort.field
      };
    }
    return null;
  }
}

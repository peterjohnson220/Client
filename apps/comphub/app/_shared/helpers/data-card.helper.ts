import { SortOption } from 'libs/models/payfactors-api/comphub';

import { QuickPriceGridContext } from '../models';

export class DataCardHelper {
  static firstDayOfMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }

  static calculateDataByRate(value: number, isHourlyRate: boolean, isAnnualShortened: boolean): number {
    if (!value) {
      return 0;
    }

    if (isHourlyRate) {
      return value / 2080;
    }

    return isAnnualShortened ? value / 1000 : value;
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

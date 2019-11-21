import { DashboardView } from '../models';

export class DashboardsHeaderHelper {

  static getDashboardViewByValue(value: string): DashboardView {
    const matchedKey = Object.keys(DashboardView).find(key => DashboardView[key] === value);
    return !!matchedKey ? DashboardView[matchedKey] : null;
  }

}

export class DataCardHelper {
  static firstDayOfMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }

  static calculateDataByHourlyRate(annualValue: number): number {
    if (!annualValue) {
      return;
    }
    return annualValue / 2080;
  }
}

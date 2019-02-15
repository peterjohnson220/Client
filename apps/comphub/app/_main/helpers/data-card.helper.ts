export class DataCardHelper {
  static firstDayOfMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }

  static calculateDataByHourlyRate(value: number): number {
    if (!value) {
      return;
    }
    return ((value * 1000) / 2080);
  }
}

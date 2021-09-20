export class RangeGraphHelper {

  static getChartMin(scatterData: number[], min: number): number {
    const minValue = Math.min(...scatterData);
    return minValue < min ? minValue : min;
  }

  static getChartMax(scatterData: number[], max: number): number {
    const maxValue = Math.max(...scatterData);
    return maxValue > max ? maxValue : max;
  }

}

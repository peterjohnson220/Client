export class GraphHelper {
  static getChartHeight(data: any, multiLineHeader: boolean = false): number {
    const defaultOffset = 56;
    const multiLineHeaderOffset = 46;
    const defaultSingleRecordHeight = 120;
    const rowHeight = 60;
    const singleDataPointOffset = 10;
    if (data.length > 1) {
      return (rowHeight * data.length) + (multiLineHeader ? (multiLineHeaderOffset + defaultOffset) : defaultOffset);
    } else if (data.length === 1) {
      return (multiLineHeader ? (multiLineHeaderOffset + defaultSingleRecordHeight + singleDataPointOffset)
        : defaultSingleRecordHeight + singleDataPointOffset);
    } else {
      return (multiLineHeader ? (multiLineHeaderOffset + defaultSingleRecordHeight) : defaultSingleRecordHeight);
    }
  }

  static getCompareChartHeight(dataLength: number, useAlignmentOffset: boolean): number {
    const defaultOffset = 56;
    const rowHeight = 60;
    let scrollOffset = 0;
    if (useAlignmentOffset) {
      scrollOffset = 15;
    }
    return (rowHeight * dataLength) + (defaultOffset + scrollOffset);
  }
}

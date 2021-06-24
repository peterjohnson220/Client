export class GraphHelper {
  static getJobsChartHeight(data: any, multiLineHeader: boolean = false): number {
    const defaultOffset = 56;
    const multiLineHeaderOffset = 46;
    const defaultSingleRecordHeight = 112;
    const rowHeight = 50;
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

  static getJobsRangeMidRadius(dataLength) {
    return dataLength === 1 ? 30 : 26;
  }

  static getEmployeeChartHeight(data: any, multiLineHeader: boolean = false): number {
    const defaultOffset = 54;
    const multiLineHeaderOffset = 46;
    const defaultSingleRecordHeight = 98;
    const rowHeight = 50;
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

  static getDataCutChartHeight(data: any, multiLineHeader: boolean = false): number {
    const defaultOffset = 56;
    const multiLineHeaderOffset = 50;
    const defaultSingleRecordHeight = 60;
    const rowHeight = 50;
    const multiLineHeaderRowHeight = 48;
    const singleDataPointOffset = 45;
    if (data.length > 1) {
      return ((multiLineHeader ? multiLineHeaderRowHeight : rowHeight) * data.length)
        + (multiLineHeader ? (multiLineHeaderOffset + defaultOffset) : defaultOffset);
    } else if (data.length === 1) {
      return (multiLineHeader ? (multiLineHeaderOffset + defaultSingleRecordHeight)
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

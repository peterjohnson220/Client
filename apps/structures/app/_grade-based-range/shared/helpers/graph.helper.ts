export class GraphHelper {
  static getChartHeight(data: any, defaultPagingCount: number, multiLineHeader: boolean = false): number {
    const defaultOffset = 55;
    const multiLineHeaderOffset = 46;
    const defaultSingleRecordHeight = 112;
    const rowHeight = 50;
    const singleDataPointOffset = 10;
    const scrollOffsetDefaultValue = data.length > 10 ? 15 : 0;
    // how we can determine ranges of 2 and then get the next range
    let defaultHigh = 2;
    let scrollOffset = 0;
    let additionalOffset = 1;

    if (data.length > defaultPagingCount) {
      // every time data increase 3 times past the previous value times 2 we need to add an additional offset to the scroll offset
      // EX: [40 , 80] -> additionalOffset = 1, [120, 160] -> additionalOffset = 2 and so on
      while ((Math.floor(data.length / defaultPagingCount) > defaultHigh)) {
        defaultHigh = defaultHigh + 2;
        additionalOffset = additionalOffset + 1;
      }
      scrollOffset = (scrollOffsetDefaultValue + additionalOffset) * (Math.floor(data.length / defaultPagingCount) + 1);
      return (rowHeight * data.length) + (multiLineHeader ? (multiLineHeaderOffset + defaultOffset) : (defaultOffset + data.length + scrollOffset));
    } else if (data.length > 1 && data.length <= defaultPagingCount) {
      scrollOffset = scrollOffsetDefaultValue * (Math.floor(data.length / defaultPagingCount) + 1);
      return (rowHeight * data.length) + (multiLineHeader ? (multiLineHeaderOffset + defaultOffset) : (defaultOffset + data.length + scrollOffset));
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

  static getDataCutChartHeight(data: any, multiLineHeader: boolean = false): number {
    const defaultOffset = 56;
    const multiLineHeaderOffset = 50;
    const multiLineSingleOffset = 90;
    const defaultSingleRecordHeight = 70;
    const rowHeight = 50;
    const multiLineHeaderRowHeight = 48;
    const singleDataPointOffset = 45;
    if (data.length > 1) {
      return ((multiLineHeader ? multiLineHeaderRowHeight : rowHeight) * data.length)
        + (multiLineHeader ? (multiLineHeaderOffset + defaultOffset) : defaultOffset);
    } else if (data.length === 1) {
      return (multiLineHeader ? (multiLineSingleOffset + defaultSingleRecordHeight)
        : defaultSingleRecordHeight + singleDataPointOffset);
    } else {
      return (multiLineHeader ? (multiLineHeaderOffset + defaultSingleRecordHeight) : defaultSingleRecordHeight);
    }
  }

  static getGbrHorizontalChartHeight(data: any): number {
    const defaultOffset = 56;
    const rowHeight = 60;
    const defaultSingleRecordHeight = 110;
    const singleDataPointOffset = 35;

    if (data.length > 1) {
      return (rowHeight * data.length) + defaultOffset;
    } else if (data.length === 1) {
      return defaultSingleRecordHeight + singleDataPointOffset;
    } else {
      return defaultSingleRecordHeight;
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

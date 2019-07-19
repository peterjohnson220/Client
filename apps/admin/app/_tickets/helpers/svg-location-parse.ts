
export class SVGLocationParse {
  static getLowerAndTrimmedValue(dataItem: any, valuefield: string): string {
    return (dataItem[valuefield] as string)
      .toLowerCase()
      .replace(/ /g, '');
  }
}

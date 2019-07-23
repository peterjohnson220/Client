
export class SVGLocationParse {
  static getLowerAndTrimmedValue(value: string): string {
    return (value as string)
      .toLowerCase()
      .replace(/ /g, '');
  }
}

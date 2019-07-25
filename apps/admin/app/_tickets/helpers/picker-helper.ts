
export class PickerHelper {

  public getLowerAndTrimmedValue(value: string): string {
    return (value as string)
      .toLowerCase()
      .replace(/ /g, '');
  }




}

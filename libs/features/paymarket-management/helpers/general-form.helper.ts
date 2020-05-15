import { GroupedListItem } from 'libs/models/list';

export class GeneralFormHelper {
  static buildAllSizeItem(): GroupedListItem {
    return {
      Name: 'All',
      Value: 'All:All',
      Level: null
    };
  }
}

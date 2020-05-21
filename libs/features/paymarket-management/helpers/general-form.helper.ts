import { GroupedListItem } from 'libs/models/list';

export class GeneralFormHelper {
  static buildAllItem(): GroupedListItem {
    return {
      Name: 'All',
      Value: 'All:All',
      Level: null,
      Children: []
    };
  }
}

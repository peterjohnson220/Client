import { MultiSelectItemGroup } from '../models';

export class MultiSelectDropdownHelper {
  static getSelectedValues(groups: MultiSelectItemGroup[]): string[] {
    const selectedValues: string[] = [];
    groups.forEach(group => {
      group.Items.forEach(item => {
        if (item.IsSelected) {
          selectedValues.push(item.Value);
        }
      });
    });
    return selectedValues;
  }
}

import { orderBy } from 'lodash';

import { KendoTypedDropDownItem } from 'libs/models/kendo';

export class PayfactorsApiModelMapper {

  static mapToDropdownList(response: any, valueField: string, nameField: string): KendoTypedDropDownItem[] {
    return this.mapItemsToDropdownList(response, valueField, (item => {
      return item[nameField];
    }));
  }

  static mapItemsToDropdownList(response: any, valueField: string, nameMappingFunction: (item: any) => string): KendoTypedDropDownItem[] {
    if (response && response.length) {
      const dropListItems = response.map(item => {
        return {
          Name: nameMappingFunction(item),
          Value: item[valueField] || null
        };
      });
      return orderBy(dropListItems, ['Name'], 'asc');
    }
    return [];
  }
}

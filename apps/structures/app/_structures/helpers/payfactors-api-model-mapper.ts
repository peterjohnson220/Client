import orderBy from 'lodash/orderBy';

import { KendoTypedDropDownItem } from 'libs/models/kendo';

export class PayfactorsApiModelMapper {
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

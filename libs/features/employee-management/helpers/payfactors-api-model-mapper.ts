import { orderBy } from 'lodash';

import { KendoTypedDropDownItem } from 'libs/models/kendo';

export class PayfactorsApiModelMapper {

  static mapToDropdownList(response: any, valueField: string, nameField: string): KendoTypedDropDownItem[] {
    if (response && response.length) {
      const dropListItems = response.map(item => {
        return {
          Name: item[nameField] || '',
          Value: item[valueField] || null
        };
      });
      return orderBy(dropListItems, ['Name'], 'asc');
    }
    return [];
  }

  static mapCurrenciesToDropdownList(response: any): KendoTypedDropDownItem[] {
    if (response && response.length) {
      const dropListItems = response.map(item => {
        return {
          Name: `${item['CurrencyCode']} - ${item['CurrencyName']}`,
          Value: item['CurrencyCode'] || null
        };
      });
      return orderBy(dropListItems, ['Name'], 'asc');
    }
    return [];
  }
}

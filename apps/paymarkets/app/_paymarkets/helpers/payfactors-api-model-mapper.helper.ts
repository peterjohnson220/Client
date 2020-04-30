import * as cloneDeep from 'lodash.clonedeep';

import { MultiSelectItemGroup } from 'libs/ui/common';
import { GroupedListItem } from 'libs/models/list';
import { ViewField } from 'libs/models/payfactors-api/reports';

export class PayfactorsApiModelMapper {
  // IN
  static mapGroupedListItemsToMultiSelectItemGroups(list: GroupedListItem[]): MultiSelectItemGroup[] {
    return list.map((g, groupIndex) => {
      const items = g.Children
        ? g.Children.map(x => {
          return {
            IsSelected: false,
            Name: x.Name,
            Value: x.Value
          };
        })
        : null;
      return {
        GroupIndex: groupIndex,
        GroupName: g.Name,
        Title: g.Name,
        Items: items
      };
    });
  }

  // OUT
  static applySelectedItemsToField(fields: ViewField[], sourceName: string, selectedValues: string[]): ViewField {
    const field: ViewField = fields.find((f: ViewField) => f.SourceName === sourceName);
    const updatedField: ViewField = cloneDeep(field);
    updatedField.FilterValues = selectedValues;
    updatedField.FilterOperator = 'in';
    return updatedField;
  }

}

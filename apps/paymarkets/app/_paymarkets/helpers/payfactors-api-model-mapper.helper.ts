import * as cloneDeep from 'lodash.clonedeep';

import { ViewField } from 'libs/models/payfactors-api/reports';

export class PayfactorsApiModelMapper {
  // OUT
  static applySelectedItemsToField(fields: ViewField[], sourceName: string, selectedValues: string[]): ViewField {
    const field: ViewField = fields.find((f: ViewField) => f.SourceName === sourceName);
    const updatedField: ViewField = cloneDeep(field);
    updatedField.FilterValues = selectedValues;
    updatedField.FilterOperator = 'in';
    return updatedField;
  }

}

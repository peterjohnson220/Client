import { orderBy } from 'lodash';

import { UpdateDataViewFieldsRequest, UserDataElement } from 'libs/models/payfactors-api';

import { FieldType, Field, Filter, UserDataView } from '../models';

export class FieldsHelper {

  static findField(fields: Field[], field: Field): Field {
    switch (field.FieldType) {
      case FieldType.DataElement: {
        return fields.find(x => x.DataElementId === field.DataElementId);
      }
      case FieldType.Formula: {
        return fields.find(x => x.FormulaId === field.FormulaId);
      }
      default: {
        return null;
      }
    }
  }

  static excludeFilter(fields: Field[], field: Field): Field[] {
    switch (field.FieldType) {
      case FieldType.DataElement: {
        return fields.filter(x => x.DataElementId !== field.DataElementId);
      }
      case FieldType.Formula: {
        return fields.filter(x => x.FormulaId !== field.FormulaId);
      }
      default: {
        return [];
      }
    }
  }

  static findFieldIndex(fields: Field[], field: Field): number {
    switch (field.FieldType) {
      case FieldType.DataElement: {
        return fields.findIndex(x => x.DataElementId === field.DataElementId);
      }
      case FieldType.Formula: {
        return fields.findIndex(x => x.FormulaId === field.FormulaId);
      }
      default: {
        return null;
      }
    }
  }

  static fieldExists(fields: Field[], field: Field): boolean {
    switch (field.FieldType) {
      case FieldType.DataElement: {
        return fields.some(x => x.DataElementId === field.DataElementId);
      }
      case FieldType.Formula: {
        return fields.some(x => x.FormulaId === field.FormulaId);
      }
      default: {
        return false;
      }
    }
  }

  static fieldExistsInFilters(filters: Filter[], field: Field): boolean {
    switch (field.FieldType) {
      case FieldType.DataElement: {
        return filters.some(x => x.Field.DataElementId === field.DataElementId);
      }
      case FieldType.Formula: {
        return filters.some(x => x.Field.FormulaId === field.FormulaId);
      }
      default: {
        return false;
      }
    }
  }

  static buildUpdateDataViewFieldsRequest(fields: Field[], userDataView: UserDataView): UpdateDataViewFieldsRequest {
    const selectedFields: Field[] = orderBy(fields, 'Order');
    const fieldsToSave: UserDataElement[] = selectedFields.map((f, index) => {
      return {
        DataElementId: f.DataElementId,
        FormulaId: f.FormulaId,
        Order: index + 1,
        DisplayName: f.DisplayName,
        Format: f.Format
      };
    });
    return {
      UserDataViewId: userDataView.UserDataViewId,
      Fields: fieldsToSave
    };
  }

}

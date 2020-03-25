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

  static removeFiltersMatchingField(filters: Filter[], field: Field): Filter[] {
    switch (field.FieldType) {
      case FieldType.DataElement: {
        return filters.filter(x => x.IsLocked || x.Field.DataElementId !== field.DataElementId);
      }
      case FieldType.Formula: {
        return filters.filter(x => x.IsLocked || x.Field.FormulaId !== field.FormulaId);
      }
      default: {
        return filters;
      }
    }
  }

  static compareField(x: Field, y: Field): boolean {
    if (x.FieldType !== y.FieldType) {
      return false;
    }
    return x.FieldType === FieldType.DataElement
      ? x.DataElementId === y.DataElementId
      : x.FormulaId === y.FormulaId;
  }

  static updateFieldFormatInFilters(filters: Filter[], field: Field): Filter[] {
    return filters.map(filter => {
      if (FieldsHelper.compareField(filter.Field, field)) {
        filter.Field.FieldFormat = field.FieldFormat;
      }
      return filter;
    });
  }

  static buildUpdateDataViewFieldsRequest(fields: Field[], userDataView: UserDataView): UpdateDataViewFieldsRequest {
    const selectedFields: Field[] = orderBy(fields, 'Order');
    const fieldsToSave: UserDataElement[] = selectedFields.map((f, index) => {
      return {
        DataElementId: f.DataElementId,
        UserFormulasId: f.FormulaId,
        Order: index + 1,
        DisplayName: f.DisplayName,
        Format: f.FieldFormat && f.FieldFormat.Value ? f.FieldFormat.Value : null,
        SortDirection: f.SortDirection,
        SortOrder: f.SortOrder
      };
    });
    return {
      UserDataViewId: userDataView.UserDataViewId,
      Fields: fieldsToSave
    };
  }

  static updateFormulaField(fields: Field[], targetField: Field): void {
    const fieldToUpdate = FieldsHelper.findField(fields, targetField);
    if (fieldToUpdate) {
      fieldToUpdate.DisplayName = fieldToUpdate.FormulaName === fieldToUpdate.DisplayName ? targetField.FormulaName : fieldToUpdate.DisplayName;
      fieldToUpdate.FormulaName = targetField.FormulaName;
      fieldToUpdate.Formula = targetField.Formula;
      fieldToUpdate.IsSortable = targetField.IsSortable;
      fieldToUpdate.DataType = targetField.DataType;
      fieldToUpdate.IsPublic = targetField.IsPublic;
    }
  }

  static updateFieldDisplayName(fields: Field[], targetField: Field, displayName: string): void {
    const fieldToUpdate = FieldsHelper.findField(fields, targetField);
    if (fieldToUpdate) {
      fieldToUpdate.DisplayName = displayName;
    }
  }

}

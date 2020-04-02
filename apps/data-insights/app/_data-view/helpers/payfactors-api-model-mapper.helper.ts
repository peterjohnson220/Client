import {
  DataViewAccessLevel,
  DataViewDataRequest,
  DataViewField,
  DataViewFieldDataType,
  DataViewFieldType,
  DataViewFilter,
  DataViewFilterIdentifier,
  DataViewFilterOptionsRequest,
  DuplicateUserViewRequest,
  PagingOptions,
  SaveUserViewFiltersRequest,
  ShareUserResponse,
  UserDataViewResponse
} from 'libs/models/payfactors-api';

import { Field, FieldDataType, FieldType, Filter, GetFilterOptionsData, SharedDataViewUser, UserDataView, FieldCreator } from '../models';
import { FilterOperatorHelper } from './filter-operator.helper';
import { Entity } from '../../_shared/models';

export class PayfactorsApiModelMapper {

  /// IN
  static mapUserDataViewResponseToUserDataView(response: UserDataViewResponse): UserDataView {
    return {
      Entity: this.createBaseEntity(response.DataView.BaseEntityId, response.DataView.Entity),
      Name: response.DataView.Name,
      Summary: response.DataView.Summary,
      UserDataViewId: response.DataView.UserDataViewId,
      AccessLevel: response.DataView.AccessLevel
    };
  }

  static createBaseEntity(id: number, name: string): Entity {
    return {
      Id: id,
      Name: name,
      IsBaseEntity: true
    };
  }

  static mapDataViewFieldsToFields(response: DataViewField[]): Field[] {
    return response.map(f => this.mapDataViewFieldToField(f));
  }

  static mapDataViewFieldToField(dataViewField: DataViewField): Field {
    return {
      EntityId: dataViewField.EntityId,
      Entity: dataViewField.Entity,
      EntitySourceName: dataViewField.EntitySourceName,
      DataElementId: dataViewField.DataElementId,
      SourceName: dataViewField.SourceName,
      DisplayName: dataViewField.DisplayName,
      KendoGridField: `${dataViewField.EntitySourceName}_${dataViewField.SourceName}`,
      DataType: this.mapDataViewFieldDataTypeToFieldDataType(dataViewField.DataType),
      IsSelected: dataViewField.IsSelected,
      Order: dataViewField.Order,
      IsSortable: dataViewField.IsSortable,
      DataElementOrder: dataViewField.DataElementOrder,
      FormulaId: dataViewField.FormulaId,
      FieldType: this.mapDataViewFieldTypeToFieldType(dataViewField.FieldType),
      IsEditable: dataViewField.AccessLevel === DataViewAccessLevel.Owner || dataViewField.AccessLevel === DataViewAccessLevel.Edit,
      Formula: dataViewField.Formula,
      FormulaName: dataViewField.FormulaName,
      SortDirection: dataViewField.SortDirection,
      SortOrder: dataViewField.SortOrder,
      IsPublic: dataViewField.IsPublic,
      AccessLevel: dataViewField.AccessLevel,
      FieldFormat: FieldCreator.generateFieldFormatProperty(dataViewField),
      Is: FieldCreator.generateIsProperty(dataViewField),
      KendoGridConfig: FieldCreator.generateKendoGridConfigProperty(dataViewField)
    };
  }

  static mapDataViewFieldDataTypeToFieldDataType(dataViewDataType: DataViewFieldDataType): FieldDataType {
    switch (dataViewDataType) {
      case DataViewFieldDataType.Int: {
        return FieldDataType.Int;
      }
      case DataViewFieldDataType.Float: {
        return FieldDataType.Float;
      }
      case DataViewFieldDataType.String: {
        return FieldDataType.String;
      }
      case DataViewFieldDataType.LongString: {
        return FieldDataType.LongString;
      }
      case DataViewFieldDataType.DateTime: {
        return FieldDataType.Date;
      }
      case DataViewFieldDataType.Bit: {
        return FieldDataType.Bit;
      }
      default: {
        return null;
      }
    }
  }

  static mapDataViewFieldTypeToFieldType(dataViewFieldType: DataViewFieldType): FieldType {
    switch (dataViewFieldType) {
      case DataViewFieldType.DataElement: {
        return FieldType.DataElement;
      }
      case DataViewFieldType.Formula: {
        return FieldType.Formula;
      }
      default: {
        return null;
      }
    }
  }

  /// OUT
  static mapFieldsToDataViewFields(response: Field[]): DataViewField[] {
    return response.map(f => this.mapFieldToDataViewField(f));
  }

  static mapFieldToDataViewField(field: Field): DataViewField {
    return {
      EntityId: field.EntityId,
      Entity: field.Entity,
      EntitySourceName: field.EntitySourceName,
      DataElementId: field.DataElementId,
      SourceName: field.SourceName,
      DisplayName: field.DisplayName,
      IsSelected: field.IsSelected,
      Order: field.Order,
      IsSortable: field.IsSortable,
      FormulaId: field.FormulaId,
      FieldType: this.mapFieldTypeToDataViewFieldType(field.FieldType),
      Format: field.FieldFormat && field.FieldFormat.Value ? field.FieldFormat.Value : null,
      SortDirection: field.SortDirection,
      SortOrder: field.SortOrder,
      IsPublic: field.IsPublic,
      AccessLevel: field.AccessLevel
    };
  }

  static mapFieldTypeToDataViewFieldType(fieldType: FieldType): DataViewFieldType {
    switch (fieldType) {
      case FieldType.DataElement: {
        return DataViewFieldType.DataElement;
      }
      case FieldType.Formula: {
        return DataViewFieldType.Formula;
      }
      default: {
        return null;
      }
    }
  }

  static buildDataViewDataRequest(
    dataView: UserDataView,
    fields: Field[],
    pagingOptions: PagingOptions,
    filters: Filter[],
    withCount: boolean): DataViewDataRequest {
    return {
      BaseEntityId: dataView.Entity.Id,
      Fields: PayfactorsApiModelMapper.mapFieldsToDataViewFields(fields),
      Filters: PayfactorsApiModelMapper.mapFiltersToDataViewFilters(filters),
      PagingOptions: pagingOptions,
      WithCount: withCount
    };
  }

  static buildDataViewFilterOptionsRequest(data: GetFilterOptionsData, baseEntityId: number): DataViewFilterOptionsRequest {
    return {
      BaseEntityId: baseEntityId,
      EntitySourceName: data.EntitySourceName,
      SourceName: data.SourceName,
      Query: data.Query
    };
  }

  static mapFiltersToDataViewFilters(data: Filter[]): DataViewFilter[] {
    return data.map((filter) => {
      return {
        Operator: filter.Operator.Value,
        Values: filter.SelectedOptions,
        EntitySourceName: filter.Field.EntitySourceName,
        SourceName: filter.Field.SourceName,
        FilterType: null,
        DisplayName: null
      };
    });
  }

  static mapFiltersToDataViewFilterIdentifier(data: Filter[]): DataViewFilterIdentifier[] {
    return data.map((filter) => {
      return {
        Operator: filter.Operator.Value,
        Values: filter.SelectedOptions,
        DataElementId: filter.Field.DataElementId,
        UserFormulaId: filter.Field.FormulaId,
        FilterType: null,
        DisplayName: null
      };
    });
  }

  static mapDataViewFiltersToFilters(data: DataViewFilter[], fields: DataViewField[]): Filter[] {
    return data.map((filter) => {
      const dataViewField = fields.find(x => x.EntitySourceName === filter.EntitySourceName && x.SourceName === filter.SourceName);
      const field = this.mapDataViewFieldToField(dataViewField);
      return {
        Field: field,
        SelectedOptions: filter.Values && filter.Values.length  && filter.Values[0] === null ? [] : filter.Values,
        Operator: FilterOperatorHelper.getFilterOperatorByDataType(field.DataType, filter),
        Options: [],
        IsValid: true,
        IsLocked: filter.IsLocked
      };
    });
  }

  static buildSaveFiltersRequest(filters: Filter[], userDataView: UserDataView): SaveUserViewFiltersRequest {
    return {
      UserDataViewId: userDataView.UserDataViewId,
      Filters: this.mapFiltersToDataViewFilterIdentifier(filters)
    };
  }

  static mapShareUserResponseToUser(data: ShareUserResponse[]): SharedDataViewUser[] {
    return data.map((user) => {
      return {
        UserId: user.UserId,
        FirstName: user.FirstName,
        LastName: user.LastName,
        EmailAddress: user.EmailAddress,
        UserPicture: user.UserPicture,
        Title: user.Title,
        CanEdit: false
      };
    });
  }

  static buildDuplicateDataViewRequest(data: UserDataView): DuplicateUserViewRequest {
    return {
      UserDataViewId: data.UserDataViewId,
      Name: data.Name,
      Summary: data.Summary
    };
  }

}

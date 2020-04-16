import { SortDescriptor } from '@progress/kendo-data-query';

import { DataView, DataViewField, DataViewFieldType, DataViewFilter, DataViewType, ViewField } from 'libs/models/payfactors-api/reports/request';

import { isValueRequired } from '../components/grid-filter/helpers';
import { PagingOptions } from '../../../models/payfactors-api/search/request';

export class DataGridToDataViewsHelper {
  static buildDataView(pageViewId: string, baseEntityId: number,
                       fields: ViewField[], sortDescriptor: SortDescriptor[], name: string, type: DataViewType): DataView {
    const selectedFields = this.mapFieldsToDataViewFields(fields, sortDescriptor);
    // TODO: Change the way we save filters. This assumes we never save GlobalFilters and we never save filters for Named Views
    const filterFields = fields.filter(f => !f.IsGlobalFilter && f.FilterValue !== null && name !== null);
    return {
      PageViewId: pageViewId,
      EntityId: baseEntityId,
      Name: name,
      Type: type,
      Elements: selectedFields,
      Filters: this.mapFieldsToFiltersUseValueProperty(filterFields)
    };
  }

  static buildDataViewDataRequest(
    baseEntityId: number, fields: ViewField[], filters: DataViewFilter[],
    pagingOptions: PagingOptions, sortDescriptor: SortDescriptor[], withCount: boolean, applyDefaultFilters: boolean) {

    return {
      BaseEntityId: baseEntityId,
      Fields: this.mapFieldsToDataViewFields(fields, sortDescriptor),
      Filters: filters,
      PagingOptions: pagingOptions,
      WithCount: withCount,
      ApplyDefaultFilters: applyDefaultFilters,
    };
  }

  static mapFieldsToDataViewFilters(fields: ViewField[]) {
    return fields.map(f => ({
      DataElementId: f.DataElementId,
      Operator: f.FilterOperator,
      Value: f.FilterValue
    }));
  }

  static mapFieldsToDataViewFields(fields: ViewField[], sortDescriptor: SortDescriptor[]): DataViewField[] {
    return fields ? fields
        .filter(f => f.IsSelected)
        .map(f => {
          const sortInfo = this.getSortInformation(f, sortDescriptor);
          return {
            EntityId: f.EntityId,
            Entity: null,
            EntitySourceName: f.EntitySourceName,
            DataElementId: f.DataElementId,
            SourceName: f.SourceName,
            DisplayName: f.DisplayName,
            DataType: f.DataType,
            IsSelected: f.IsSelected,
            IsSortable: false,
            Order: f.Order,
            FieldType: DataViewFieldType.DataElement,
            SortOrder: !!sortInfo ? sortInfo.SortOrder : null,
            SortDirection: !!sortInfo ? sortInfo.SortDirection : null
          };
        })
      : [];
  }

  static mapFieldsToFiltersUseValuesProperty(fields: ViewField[]): DataViewFilter[] {
    return fields
      .filter(field => (field.FilterValue !== null || !!field.FilterValues) || !isValueRequired(field))
      .map(field => <DataViewFilter>{
        EntitySourceName: field.EntitySourceName,
        SourceName: field.SourceName,
        Operator: field.FilterOperator,
        Values: field.FilterValues ? field.FilterValues : [field.FilterValue],
        DataType: field.DataType,
        FilterType: field.CustomFilterStrategy
      });
  }

  static mapFieldsToFiltersUseValueProperty(fields: ViewField[]): DataViewFilter[] {
    return fields
      .filter(field => field.FilterValue !== null || !isValueRequired(field))
      .map(field => <DataViewFilter>{
        EntitySourceName: field.EntitySourceName,
        SourceName: field.SourceName,
        Operator: field.FilterOperator,
        Value: field.FilterValue,
        DataType: field.DataType,
        FilterType: field.CustomFilterStrategy,
        DataElementId: field.DataElementId
      });
  }

  static getFiltersForExportView(fields: ViewField[], selectionField: string, selectedKeys: number[]): DataViewFilter[] {
    const filters = this.mapFieldsToFiltersUseValueProperty(fields);
    if (!!selectedKeys && !!selectedKeys.length) {
      const field: ViewField = fields.find(f => f.SourceName === selectionField);
      for (const selectedKey of selectedKeys) {
        const selectedKeysFilter: DataViewFilter = {
          DataElementId: field.DataElementId,
          EntitySourceName: field.EntitySourceName,
          SourceName: field.SourceName,
          Operator: '=',
          Value: selectedKey.toString()
        };
        filters.push(selectedKeysFilter);
      }
    }
    return filters;
  }

  private static getSortInformation(field: ViewField, sortDescriptor: SortDescriptor[]) {
    if (!!sortDescriptor && sortDescriptor.length > 0) {
      const sortInfo = sortDescriptor.find(x => x.field === `${field.EntitySourceName}_${field.SourceName}`);
      if (!!sortInfo) {
        return {
          SortDirection: sortInfo.dir,
          SortOrder: sortDescriptor.indexOf(sortInfo)
        };
      } else {
        return null;
      }
    }
    return null;
  }
}

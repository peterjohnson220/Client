import { SortDescriptor } from '@progress/kendo-data-query';

import {
  DataViewEntityResponse,
  SaveWorkbookOrderRequest,
  TableauReportResponse,
  TableauReportViewsResponse,
  UpsertUserReportTag,
  UserDataViewResponse,
  DataViewDataRequest,
  DataViewField,
  PagingOptions,
  DataViewFilterOptionsRequest,
  DataViewFilter,
  SaveUserViewFiltersRequest,
  DataViewFieldDataType,
  ShareUserResponse
} from 'libs/models/payfactors-api';
import { WorkbookOrderType } from 'libs/constants';
import { generateDefaultAsyncStateObj } from 'libs/models';

import {
  DashboardView,
  Entity,
  ReportType,
  SaveWorkbookTagObj,
  UserDataView,
  View,
  Workbook,
  Field,
  GetFilterOptionsData,
  Filter,
  FieldDataType,
  SharedDataViewUser
} from '../models';
import { FilterOperatorHelper } from './filter-operator.helper';

export class PayfactorsApiModelMapper {


  /// IN
  static mapTableauReportResponsesToWorkbooks(response: TableauReportResponse[], companyName?: string): Workbook[] {
    return response.map(r => {
      let views = null;
      if (r.Views) {
        views = generateDefaultAsyncStateObj<View[]>([]);
        views.obj = this.mapTableauReportViewsResponsesToViews(r.Views);
      }
      return {
        Type: r.ReportType === 'TableauReport' ? ReportType.TableauReport : ReportType.DataView,
        WorkbookId: r.WorkbookId,
        WorkbookName: r.WorkbookName,
        Thumbnail: r.Thumbnail,
        WorkbookDescription: r.WorkbookDescription,
        ContentUrl: r.ContentUrl,
        ShowTabs: r.ShowTabs,
        IconClass: r.IconClass,
        Tag: r.Tag,
        IsFavorite: r.IsFavorite,
        IsStandard: companyName ? false : true,
        SourceUrl: companyName ? '/company-reports' : '/standard-reports',
        DefaultTag: companyName ? `${companyName} Reports` : 'Payfactors Reports',
        DashboardsOrder: r.DashboardsOrder,
        FavoritesOrder: r.FavoritesOrder,
        Views: views
      };
    });
  }

  static mapTableauReportViewsResponsesToViews(response: TableauReportViewsResponse[]): View[] {
    return response.map(r => {
      return {
        ContentUrl: r.ContentUrl,
        ViewId: r.ViewId,
        ViewName: r.ViewName,
        ViewThumbnail: r.ViewThumbnail,
        IsFavorite: r.IsFavorite,
        ViewsOrder: r.ViewsOrder,
        FavoritesOrder: r.FavoritesOrder,
        WorkbookId: r.WorkbookId
      };
    });
  }

  static mapDataViewEntityResponsesToEntities(response: DataViewEntityResponse[]): Entity[] {
    return response.map(e => {
      return {
        Id: e.EntityId,
        Name: e.Entity,
        IsBaseEntity: e.IsBaseEntity
      };
    });
  }

  static mapUserDataViewResponseToUserDataView(response: UserDataViewResponse): UserDataView {
    return {
      BaseEntityId: response.DataView.BaseEntityId,
      Entity: response.DataView.Entity,
      Name: response.DataView.Name,
      Summary: response.DataView.Summary,
      UserDataViewId: response.DataView.UserDataViewId,
      SortField: response.DataView.SortField,
      SortDir: response.DataView.SortDir,
      AccessLevel: response.DataView.AccessLevel
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
      DataElementOrder: dataViewField.DataElementOrder
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

  /// OUT
  static mapSaveWorkbookTagObjToUpsertUserReportTag(saveWorkbookTagObj: SaveWorkbookTagObj): UpsertUserReportTag {
    return  {
      WorkbookId: saveWorkbookTagObj.WorkbookId,
      Tag: saveWorkbookTagObj.Tag
    };
  }

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
      IsSortable: field.IsSortable
    };
  }

  static buildSaveWorkbookOrderRequest(workbookIds: string[], view: DashboardView,
    typeOverride?: WorkbookOrderType): SaveWorkbookOrderRequest {
    const typeByView = view === DashboardView.All
      ? WorkbookOrderType.DashboardsOrdering
      : WorkbookOrderType.FavoritesOrdering;
    const workbookOrderType = !!typeOverride ? typeOverride : typeByView;
    return {
      WorkbookIds: workbookIds,
      Type: workbookOrderType
    };
  }

  static buildDataViewDataRequest(
    dataView: UserDataView,
    fields: Field[],
    pagingOptions: PagingOptions,
    sortDescriptor: SortDescriptor,
    filters: Filter[]): DataViewDataRequest {

    let dataViewSortDesc = null;
    if (!!sortDescriptor && !!sortDescriptor.dir && !!sortDescriptor.field) {
      const field: Field = fields.find(x => x.KendoGridField === sortDescriptor.field);
      const dataViewField: DataViewField = !!field ? this.mapFieldToDataViewField(field) : null;
      dataViewSortDesc = {
        SortField: dataViewField,
        SortDirection: sortDescriptor.dir
      };
    }
    return {
      BaseEntityId: dataView.BaseEntityId,
      Fields: PayfactorsApiModelMapper.mapFieldsToDataViewFields(fields),
      Filters: PayfactorsApiModelMapper.mapFiltersToDataViewFilters(filters),
      PagingOptions: pagingOptions,
      SortDescriptor: dataViewSortDesc
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

  static mapDataViewFiltersToFilters(data: DataViewFilter[], fields: DataViewField[]): Filter[] {
    return data.map((filter) => {
      const dataViewField = fields.find(x => x.EntitySourceName === filter.EntitySourceName && x.SourceName === filter.SourceName);
      const field = this.mapDataViewFieldToField(dataViewField);
      return {
        Field: field,
        SelectedOptions: filter.Values,
        Operator: FilterOperatorHelper.getFilterOperatorByDataType(field.DataType, filter),
        Options: [],
        IsValid: true
      };
    });
  }

  static buildSaveFiltersRequest(filters: Filter[], userDataView: UserDataView): SaveUserViewFiltersRequest {
    return {
      UserDataViewId: userDataView.UserDataViewId,
      Filters: this.mapFiltersToDataViewFilters(filters)
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

}

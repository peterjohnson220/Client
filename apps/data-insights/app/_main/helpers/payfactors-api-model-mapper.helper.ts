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
  DataViewFilterOptionsRequest, DataViewFilter, SaveUserViewFiltersRequest
} from 'libs/models/payfactors-api';
import { WorkbookOrderType } from 'libs/constants';

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
  Filter
} from '../models';
import { generateDefaultAsyncStateObj } from 'libs/models';

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
        FavoritesOrder: r.FavoritesOrder
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
      SortDir: response.DataView.SortDir
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
      DataType: dataViewField.DataType,
      IsSelected: dataViewField.IsSelected,
      Order: dataViewField.Order
    };
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
      DataType: field.DataType,
      IsSelected: field.IsSelected,
      Order: field.Order
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

  static buildDataViewFilterOptionsRequest(data: GetFilterOptionsData): DataViewFilterOptionsRequest {
    return {
      EntitySourceName: data.EntitySourceName,
      SourceName: data.SourceName,
      Query: data.Query
    };
  }

  static mapFiltersToDataViewFilters(data: Filter[]): DataViewFilter[] {
    return data.map((filter) => {
      return {
        Operator: 'in',
        Values: filter.SelectedOptions,
        EntitySourceName: filter.Field.EntitySourceName,
        SourceName: filter.Field.SourceName
      };
    });
  }

  static mapDataViewFiltersToFilters(data: DataViewFilter[], fields: DataViewField[]): Filter[] {
    return data.map((filter) => {
      return {
        Field: fields.find(x => x.EntitySourceName === filter.EntitySourceName && x.SourceName === filter.SourceName),
        SelectedOptions: filter.Values,
        Term: 'equals',
        Options: []
      };
    });
  }

  static buildSaveFiltersRequest(filters: Filter[], userDataView: UserDataView): SaveUserViewFiltersRequest {
    return {
      UserDataViewId: userDataView.UserDataViewId,
      Filters: this.mapFiltersToDataViewFilters(filters)
    };
  }

}

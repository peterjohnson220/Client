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
  DataViewSortDescriptor
} from 'libs/models/payfactors-api';
import { WorkbookOrderType } from 'libs/constants';

import { DashboardView, Entity, ReportType, SaveWorkbookTagObj, UserDataView, View, Workbook, Field } from '../models';
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
      BaseEntityId: response.BaseEntityId,
      Entity: response.Entity,
      Name: response.Name,
      Summary: response.Summary,
      UserDataViewId: response.UserDataViewId,
      SortField: response.SortField,
      SortDir: response.SortDir
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
    sortDescriptor: SortDescriptor): DataViewDataRequest {

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
      Filters: [],
      PagingOptions: pagingOptions,
      SortDescriptor: dataViewSortDesc
    };

  }

}

import { Action } from '@ngrx/store';
import { DataViewExportListItem } from "../models";

export const GET_DATA_VIEWS_EXPORT_LIST_ITEMS = '[Notifications / Data Views Export] Get Data Views Exports';
export const GET_DATA_VIEWS_EXPORT_LIST_ITEMS_SUCCESS = '[Notifications / Data Views Export] Get Data Views Exports Success';
export const GET_DATA_VIEWS_EXPORT_LIST_ITEMS_ERROR = '[Notifications / Data Views Export] Get Data Views Exports Error';

export class GetDataViewsExportsListItems implements Action {
  readonly type = GET_DATA_VIEWS_EXPORT_LIST_ITEMS;

  constructor() {}
}

export class GetDataViewsExportsListItemsSuccess implements Action {
  readonly type = GET_DATA_VIEWS_EXPORT_LIST_ITEMS_SUCCESS;

  constructor(public payload: DataViewExportListItem[]) {}
}

export class GetDataViewsExportsListItemsError implements Action {
  readonly type = GET_DATA_VIEWS_EXPORT_LIST_ITEMS_ERROR;

  constructor() {}
}

export type Actions
  = GetDataViewsExportsListItems
  | GetDataViewsExportsListItemsSuccess
  | GetDataViewsExportsListItemsError;

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  CreateUserViewRequest,
  DataViewEntityResponse,
  UserDataViewResponse,
  DataViewDataRequest,
  DataViewField,
  EditUserViewRequest,
  DuplicateUserViewRequest,
  UpdateDataViewFieldsRequest,
  DeleteUserViewRequest,
  SaveUserDataViewSortOrderRequest,
  DataViewFilterOptionsRequest,
  SaveUserViewFiltersRequest,
  ShareUserDataViewRequest,
  SharedUserPermission,
  RemoveSharePermissionRequest,
  SaveDataViewRequest,
  DataViewEntityResponseWithCount,
  ValidateFormulaResponse,
  ValidateFormulaRequest,
  UpsertFormulaFieldRequest
} from 'libs/models/payfactors-api';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class DataViewApiService {
  private endpoint = 'DataViews';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getBaseEntities(): Observable<DataViewEntityResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetBaseEntities`);
  }

  saveUserDataView(request: CreateUserViewRequest): Observable<number> {
    return this.payfactorsApiService.post(`${this.endpoint}/CreateUserDataView`, request);
  }

  editUserDataView(request: EditUserViewRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/EditUserDataView`, request);
  }

  duplicateUserDataView(request: DuplicateUserViewRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/DuplicateUserDataView`, request);
  }

  deleteUserDateView(request: DeleteUserViewRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/DeleteUserDataView`, request);
  }

  getUserDataView(dataViewId: number): Observable<UserDataViewResponse> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetUserDataViewInfo`, { params: { dataViewId: dataViewId } });
  }

  exportUserDataView(dataViewId: number): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/ExportDataView`, { DataViewId: dataViewId });
  }

  getExportingDataView(dataViewId: number): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetExportingDataView`, { DataViewId : dataViewId });
  }

  getUserDataViewFields(dataViewId: number): Observable<DataViewField[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetUserDataViewFields`, { params: { dataViewId: dataViewId } });
  }

  getData(request: DataViewDataRequest): Observable<any[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetData`, request);
  }

  getDataWithCount(request: DataViewDataRequest): Observable<DataViewEntityResponseWithCount> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetDataWithCount`, request);
  }

  updateDataViewFields(request: UpdateDataViewFieldsRequest): Observable<any[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpdateDataViewFields`, request);
  }

  saveUserDataViewSortOrder(request: SaveUserDataViewSortOrderRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveUserDataViewSortOrder`, request);
  }

  getFilterOptions(request: DataViewFilterOptionsRequest): Observable<string[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetFilterOptions`, request);
  }

  saveFilters(request: SaveUserViewFiltersRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveFilters`, request);
  }

  shareDataView(request: ShareUserDataViewRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/ShareDataView`, request);
  }

  getSharePermissions(dataViewId: number): Observable<SharedUserPermission[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetSharePermissions`, { params: { dataViewId: dataViewId }});
  }

  removeSharePermission(request: RemoveSharePermissionRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/RemoveSharePermission`, request);
  }

  getDataViewConfig(pageViewId: string, name: string) {
    const params = {
      pageViewId: pageViewId
    };
    if (name) {
      params['viewName'] = name;
    }
    return this.payfactorsApiService.get(`${this.endpoint}/GetViewConfig`, { params: params });
  }

  updateDataView(request: SaveDataViewRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveView`, request);
  }

  getViewsByUser(pageViewId: string) {
    return this.payfactorsApiService.get(`${this.endpoint}/GetViewsByUser`, { params: { pageViewId: pageViewId}});
  }

  validateFormula(request: ValidateFormulaRequest): Observable<ValidateFormulaResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/ValidateFormula`, request);
  }

  upsertFormulaField(request: UpsertFormulaFieldRequest): Observable<DataViewField> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpsertFormulaField`, request);
  }
}

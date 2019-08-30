import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  CreateUserViewRequest, DataViewEntityResponse, UserDataViewResponse,
  DataViewDataRequest, DataViewField, EditUserViewRequest,
  DuplicateUserViewRequest, UpdateDataViewFieldsRequest, DeleteUserViewRequest } from 'libs/models/payfactors-api';
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
    return this.payfactorsApiService.get(`${this.endpoint}/GetUserDataViewInfo`, { params: { dataViewId: dataViewId }});
  }

  getUserDataViewFields(dataViewId: number): Observable<DataViewField[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetUserDataViewFields`,
      { params: { dataViewId: dataViewId }});
  }

  getData(request: DataViewDataRequest): Observable<any[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetData`, request);
  }

  updateDataViewFields(request: UpdateDataViewFieldsRequest): Observable<any[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpdateDataViewFields`, request);
  }
}

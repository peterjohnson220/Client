import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import {
  AddUserFilterRequest,
  GetListAreaColumnsRequest,
  SaveListAreaColumnsRequest
} from '../../../models/payfactors-api/user-profile/request';
import { ListAreaColumnResponse, UserFilterResponse } from '../../../models/payfactors-api/user-profile/response';
import { JdmListFilter } from '../../../models/user-profile';

@Injectable()
export class UserProfileApiService {
  private endpoint = 'UserProfile';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  addUserFilter(request: AddUserFilterRequest): Observable<UserFilterResponse> {
    return this.payfactorsApiService.post<UserFilterResponse>(`${this.endpoint}.AddUserFilter`, request);
  }

  deleteUserFilter(id: string): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}.DeleteUserFilter`, {id: id});
  }

  getListAreaColumns(request: GetListAreaColumnsRequest): Observable<ListAreaColumnResponse[]> {
    return this.payfactorsApiService.get<ListAreaColumnResponse[]>(`${this.endpoint}.GetListAreaColumns`, {params: request});
  }

  getUserFilterList(): Observable<JdmListFilter[]> {
    return this.payfactorsApiService.get<JdmListFilter[]>(`${this.endpoint}.GetFilterList`);
  }

  saveListAreaColumns(request: SaveListAreaColumnsRequest): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}.SaveListAreaColumns`, request);
  }
}

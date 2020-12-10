import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UserProfile } from 'libs/models/user-profile';

import { PayfactorsApiService } from '../payfactors-api.service';
import {
  AddUserFilterRequest,
  GetListAreaColumnsRequest,
  SaveListAreaColumnsRequest
} from '../../../models/payfactors-api/user-profile/request';
import { ListAreaColumnResponse, UserFilterResponse } from '../../../models/payfactors-api/user-profile/response';
import { GetUserFilterListResponse } from '../../../models/payfactors-api/user-filter/response/get-user-filter-list-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileApiService {
  private endpoint = 'UserProfile';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  addUserFilter(request: AddUserFilterRequest): Observable<UserFilterResponse> {
    return this.payfactorsApiService.post<UserFilterResponse>(`${this.endpoint}.AddUserFilter`, { userFilter: request });
  }

  deleteUserFilter(id: string): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}.DeleteUserFilter`, {id: id});
  }

  getListAreaColumns(request: GetListAreaColumnsRequest): Observable<ListAreaColumnResponse[]> {
    return this.payfactorsApiService.get<ListAreaColumnResponse[]>(`${this.endpoint}.GetListAreaColumns`, {params: request});
  }

  getUserFilterList(): Observable<GetUserFilterListResponse[]> {
    return this.payfactorsApiService.get<GetUserFilterListResponse[]>(`${this.endpoint}.GetFilterList`);
  }

  saveListAreaColumns(request: SaveListAreaColumnsRequest): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}.SaveListAreaColumns`, request);
  }

  saveUserProfile(request: UserProfile): Observable<boolean> {
    return this.payfactorsApiService.post<boolean>(`${this.endpoint}.SaveUserProfile`, { UserProfile: request });
  }
}

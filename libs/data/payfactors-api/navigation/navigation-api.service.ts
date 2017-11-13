import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NavigationLink } from '../../../models/navigation';

@Injectable()
export class NavigationApiService {

  constructor(private http: HttpClient) {}

  getHeaderDropdownNavigationLinks() {
    return this.http.get<NavigationLink[]>('/odata/Navigation.GetHeaderDropdownNavigationLinks');
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CompanyResources, CompanyResourcePost } from '../../../../apps/dashboard/app/_main/models';
import { CompanyResourceFolder } from 'apps/dashboard/app/_main/models/company-resource-folder.model';

const endpoint = 'CompanyResources';

@Injectable()
export class CompanyResourcesApiService {

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCompanyResources(): Observable<CompanyResources> {
    return this.payfactorsApiService.get(endpoint);
  }

  addCompanyResource(companyResource: CompanyResourcePost): Observable<any> {
    return this.payfactorsApiService.post<any>(`${endpoint}/CompanyResources/Default.CreateNewCompanyResource`, companyResource);
  }

  deleteCompanyResource(companyResourceId: number): Observable<any> {
    return this.payfactorsApiService.delete<any>(`${endpoint}(${companyResourceId})`);
  }

  addCompanyResourceFolder(companyResourceFolder: CompanyResourceFolder): Observable<string> {
    return this.payfactorsApiService.post<any>('CompanyResourceFolders', companyResourceFolder);
  }

  deleteCompanyResourceFolder(folderId): Observable<string> {
    return this.payfactorsApiService.post<any>(`CompanyResourceFolders(${folderId})`);
  }
}

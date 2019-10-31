import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CompanyResources } from '../../../../apps/dashboard/app/_main/models';
import { CompanyResourceFolderPost } from 'apps/dashboard/app/_main/models/company-resource-folder-post.model';

const endpoint = 'CompanyResources';

@Injectable()
export class CompanyResourcesApiService {

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getCompanyResources(): Observable<CompanyResources> {
    return this.payfactorsApiService.get(endpoint);
  }

  addCompanyResource(companyResource): Observable<any> {
    return this.payfactorsApiService.post<any>(`${endpoint}/Default.CreateNewCompanyResource?$format=application/json;odata.metadata=none`, companyResource);
  }

  deleteCompanyResource(resourceId): Observable<any> {
    return this.payfactorsApiService.delete<any>(`${endpoint}(${resourceId})`);
  }

  addCompanyResourceFolder(companyResourceFolder: CompanyResourceFolderPost): Observable<string> {
    return this.payfactorsApiService.post<any>('CompanyResourceFolders?$format=application/json;odata.metadata=none', companyResourceFolder);
  }

  deleteCompanyResourceFolder(folderId): Observable<string> {
    return this.payfactorsApiService.delete<any>(`CompanyResourceFolders(${folderId})`);
  }

  uploadCompanyResource(resource) {
    return this.payfactorsApiService.post<any>('CloudFiles.UploadCompanyResource', resource);
  }

  removeCompanyResource(resource) {
    return this.payfactorsApiService.post<any>('CloudFiles.DeleteCompanyResources', resource);
  }
}

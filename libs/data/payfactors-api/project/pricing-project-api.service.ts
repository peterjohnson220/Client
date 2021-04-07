// This service is for the EF Core PricingProjectController used for the projects page re-write.
// The legacy services will still remain intact

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BulkProjectShareRequest } from 'libs/models/share-modal/bulk-project-share-request';
import { ProjectListTooltipRequest, ProjectListTooltipResponse } from 'libs/models/projects/tooltips';

import { PayfactorsApiService } from '../payfactors-api.service';
import { ProjectExportRequest } from '../../../models/projects/project-export-manager/project-export-request.model';


@Injectable({
  providedIn: 'root',
})
export class PricingProjectApiService {
  private endpoint = 'PricingProject';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  togglePinToDashboard(projectId: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/TogglePinToDashboard`, projectId);
  }

  copyProject(projectId: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/CopyProject`, projectId);
  }

  deleteProjects(projectIds: any[]) {
    return this.payfactorsApiService.post(`${this.endpoint}/DeleteProjects`, projectIds);
  }

  getPricingProject(projectId: number) {
    return this.payfactorsApiService.get(`${this.endpoint}/GetPricingProject?projectId=${projectId}`);
  }

  exportPricingProject(request: ProjectExportRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}/PublishProjectsExportMessage`, request);
  }

  bulkProjectShare(request: BulkProjectShareRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}/BulkShareProjectsAndSendEmail`, request);
  }

  getTooltipContent(request: ProjectListTooltipRequest): Observable<ProjectListTooltipResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetTooltipContent`, request);
  }
}


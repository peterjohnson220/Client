import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import { PayfactorsApiService } from '../payfactors-api.service';
import { SaveSettingsRequest } from '../../../../apps/total-rewards/app/shared/models/request-models';
import { Settings } from '../../../../apps/total-rewards/app/shared/models/';

@Injectable()
export class TotalRewardsApiService {
  private endpoint = 'TotalRewards';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getStatements(searchTerm?: string): Observable<GridDataResult> {
    const params = searchTerm ? {params: {searchTerm}} : {};
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetStatements`, params, MappingHelper.mapListAreaResultToAggregateGridDataResult);
  }

  getStatementFromTemplateId(templateId: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetStatementFromTemplateId`, {params: { templateId }});
  }

  getStatementFromId(statementId: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetStatementFromId`, {params: { statementId }});
  }

  saveStatement(statement: any): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SaveStatement`, statement);
  }

  saveStatementSettings(request: SaveSettingsRequest): Observable<Settings> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/SaveStatementSettings`, request);
  }

  resetStatementSettings(statementId: string): Observable<Settings> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/ResetStatementSettings?statementId=${statementId}`);
  }
}

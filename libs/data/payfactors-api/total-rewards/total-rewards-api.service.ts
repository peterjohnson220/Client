import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import { PayfactorsApiService } from '../payfactors-api.service';
import { SaveSettingsRequest } from '../../../../apps/total-rewards/app/shared/models/request-models';
import { Settings, Statement } from '../../../../apps/total-rewards/app/shared/models/';

@Injectable()
export class TotalRewardsApiService {
  private endpoint = 'TotalRewards';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getStatements(searchTerm?: string): Observable<GridDataResult> {
    const params = searchTerm ? {params: {searchTerm}} : {};
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetStatements`, params, MappingHelper.mapListAreaResultToAggregateGridDataResult);
  }

  getStatementFromTemplateId(templateId: string): Observable<Statement> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetStatementFromTemplateId`, {params: { templateId }}, this.mapStatement);
  }

  getStatementFromId(statementId: string): Observable<Statement> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetStatementFromId`, {params: { statementId }}, this.mapStatement);
  }

  saveStatement(statement: any): Observable<Statement> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SaveStatement`, statement, this.mapStatement);
  }

  saveStatementSettings(request: SaveSettingsRequest): Observable<Settings> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/SaveStatementSettings`, request);
  }

  resetStatementSettings(statementId: string): Observable<Settings> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/ResetStatementSettings?statementId=${statementId}`);
  }

  getTemplates(): Observable<any[]> {
    return this.payfactorsApiService.get<any[]>(`${this.endpoint}/GetTemplates`);
  }

  deleteStatementImage(fileName: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/DeleteStatementImage?fileName=${fileName}`);
  }

  private mapStatement(statement: Statement) {
    return { ...statement, EffectiveDate: (statement.EffectiveDate) ? new Date(statement.EffectiveDate) : null };
  }

  searchEmployees(searchRequest: any) {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchEmployees`, searchRequest);
  }
}

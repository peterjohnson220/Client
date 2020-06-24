import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import { PayfactorsApiService } from '../payfactors-api.service';
import { CompanyEmployee } from '../../../models/company';

import { SaveSettingsRequest } from 'apps/total-rewards/app/shared/models/request-models';
import { Settings, Statement } from 'apps/total-rewards/app/shared/models/';

@Injectable()
export class TotalRewardsApiService {
  private endpoint = 'TotalRewards';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getStatements(searchTerm?: string): Observable<GridDataResult> {
    const params = searchTerm ? {params: {searchTerm}} : {};
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetStatements`, params, MappingHelper.mapListAreaResultToAggregateGridDataResult);
  }

  createStatementFromTemplateId(templateId: string): Observable<string> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/CreateStatementFromTemplateId?templateId=${templateId}`, this.mapStatement);
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

  deleteStatement(statementId: string): Observable<any> {
    return this.payfactorsApiService.delete<any>(`${this.endpoint}/DeleteStatement?statementId=${statementId}`);
  }

  deleteStatementImage(fileName: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/DeleteStatementImage?fileName=${fileName}`);
  }

  private mapStatement(statement: Statement) {
    // make sure we have a new Date() for our effective date and not just a string
    return { ...statement, EffectiveDate: (statement.EffectiveDate) ? new Date(statement.EffectiveDate) : null };
  }
}

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { PayfactorsApiService } from '../payfactors-api.service';
import { StatementListSearchRequest } from 'libs/models/payfactors-api/total-rewards/request';
import { StatementListResponse } from 'libs/models/payfactors-api/total-rewards/response';

import { SaveSettingsRequest } from 'apps/total-rewards/app/shared/models/request-models';
import { Settings, Statement, StatementForPrint } from 'apps/total-rewards/app/shared/models/';


@Injectable()
export class TotalRewardsApiService {
  private endpoint = 'TotalRewards';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  static validateEffectiveDate(statement: Statement) {
    // make sure we have a new Date() for our effective date and not just a string
    return { ...statement, EffectiveDate: (statement.EffectiveDate) ? new Date(statement.EffectiveDate) : null };
  }

  getStatements(searchRequest: StatementListSearchRequest): Observable<StatementListResponse> {
    return this.payfactorsApiService.post<StatementListResponse>(`${this.endpoint}/GetStatements`, searchRequest);
  }

  createStatementFromTemplateId(templateId: string): Observable<string> {
    return this.payfactorsApiService.post<any>(
      `${this.endpoint}/CreateStatementFromTemplateId?templateId=${templateId}`, TotalRewardsApiService.validateEffectiveDate);
  }

  getStatementFromId(statementId: string): Observable<Statement> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetStatementFromId`, {params: { statementId }}, TotalRewardsApiService.validateEffectiveDate);
  }

  getStatementForPrint(pdfId: string): Observable<StatementForPrint> {
    return this.payfactorsApiService.get<any>(
      `${this.endpoint}/GetStatementForPrint?pdfId=${pdfId}`, {}, TotalRewardsApiService.validateEffectiveDate);
  }

  saveStatement(statement: any): Observable<Statement> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SaveStatement`, statement, TotalRewardsApiService.validateEffectiveDate);
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
}

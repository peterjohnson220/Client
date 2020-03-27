import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import { PayfactorsApiService } from '../payfactors-api.service';

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
}

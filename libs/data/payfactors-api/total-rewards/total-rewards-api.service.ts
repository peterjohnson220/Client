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
    const params = searchTerm ? { params: { searchTerm } } : {};
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetStatements`, params, MappingHelper.mapListAreaResultToAggregateGridDataResult);
  }

  validateStatementName(statementName: string): Observable<boolean> {
    // pass in v => v as a noop since the default extractValueFromOdata mapping func returns {} for a false value
    return this.payfactorsApiService.get<boolean>(`${this.endpoint}/ValidateStatementName`, { params: { statementName } }, v => v);
  }

  createStatement(params: { Name: string, TemplateId: number }): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/CreateStatement`, params);
  }
}

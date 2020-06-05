import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

import { GenerateStatementsRequest } from 'apps/total-rewards/app/_main/statement-assignment/models';

@Injectable()
export class TotalRewardsPdfGenerationService {
  private endpoint = 'TotalRewardsPdfGeneration';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  generateStatements(request: GenerateStatementsRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}/Create`, request);
  }
}

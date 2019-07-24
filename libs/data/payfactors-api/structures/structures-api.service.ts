import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CompanyStructure } from '../../../models/structures/company-structure.model';

@Injectable()
export class StructuresApiService {
  private readonly endpoint = 'Structure';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCompanyStructure(companyStructureId: number): Observable<CompanyStructure> {
    return this.payfactorsApiService.get<CompanyStructure>(`${this.endpoint}/GetStructureById`,
      { params: { companyStructureId: companyStructureId } });
  }
}

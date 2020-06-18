import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';
import { ImportActionEnum } from 'libs/constants';

@Injectable()
export class ExchangeJobMappingService {
  private endpoint = 'ExchangeJobAssociation';

  constructor(
    private store: Store,
    private payfactorsApiService: PayfactorsApiService
  ) {
  }

  validateAndLoadAssociations(filename: string, exchangeId: number, importAction: ImportActionEnum): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Process`, {
      FileName: filename,
      ExchangeId: exchangeId,
      ImportAction: importAction
    });
  }

  validateAndLoadBulkAssociations(fileName: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/ProcessBulkFile?fileName=${fileName}`
    );
  }
}

import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';
import { ImportActionEnum } from 'libs/constants';

import * as fromPeerMainReducer from '../reducers';
import * as fromExchangeJobMappingGridActions from '../../_manage/actions/exchange-job-mapping-grid.actions';

@Injectable()
export class ExchangeJobMappingService {
  exchangeJobMappingsGridState$: Observable<any>;
  private endpoint = 'ExchangeJobAssociation';

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private payfactorsApiService: PayfactorsApiService
  ) {
    this.exchangeJobMappingsGridState$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsGridState);
  }

  loadExchangeJobMappings(): void {
    this.exchangeJobMappingsGridState$.pipe(take(1)).subscribe(gridState => {
      this.store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappings());
    });
  }

  validateAndLoadAssociations(filename: string, exchangeId: number, importAction: ImportActionEnum): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Process`, {
      FileName: filename,
      ExchangeId: exchangeId,
      ImportAction: importAction
    });
  }
}

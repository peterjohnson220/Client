import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as fromAssociateJobsActions from '../actions/associate-jobs.actions';
import { ExchangeCompanyApiService } from '../../../../data/payfactors-api/peer';

@Injectable()
export class AssociateJobsEffects {
  @Effect()
  downloadAssociations$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssociateJobsActions.DOWNLOAD_ASSOCIATIONS),
    map((action: fromAssociateJobsActions.DownloadAssociations) => action.payload),
    switchMap((payload) => {
      return this.exchangeCompanyApiService.downloadAssociations(payload.entityId, payload.entityType).pipe(map(() => {
          return new fromAssociateJobsActions.DownloadAssociationsSuccess;
        }),
        catchError(error => of(new fromAssociateJobsActions.DownloadAssociationsError()))
      );
    })
  );

  constructor(private actions$: Actions, private exchangeCompanyApiService: ExchangeCompanyApiService) {}

}

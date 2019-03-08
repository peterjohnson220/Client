import { Injectable} from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {catchError, map, mapTo, switchMap, tap, withLatestFrom} from 'rxjs/operators';

import { ExchangeCompanyApiService } from '../../../../data/payfactors-api/peer';
import { ExchangeJobAssociation } from '../models';

import * as fromReducer from '../reducers';
import * as fromJobAssociationModalActions from '../actions/job-association-modal.actions';
import { WindowCommunicationService } from 'libs/core/services';

@Injectable()
export class JobAssociationModalEffects {

  @Effect()
  saveJobAssociations$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAssociationModalActions.SAVE_JOB_ASSOCIATIONS),
    withLatestFrom(
      this.store.pipe(
        select(fromReducer.getExchangeJobAssociations)),
      (action, exchangeJobAssociations: ExchangeJobAssociation[]) => ({ exchangeJobAssociations })
    ),
    map(exchangeJobAssociations => exchangeJobAssociations.exchangeJobAssociations
      .map((associations => ({
          ExchangeId: associations.ExchangeId,
          ExchangeJobId: associations.ExchangeJobId,
          CompanyJobIds: associations.CompanyJobs.map(({ CompanyJobId }) => CompanyJobId) })
      ))
    ),
    switchMap(associations =>
      this.exchangeCompanyApiService.saveJobAssociations(associations).pipe(
        map(() => {
          return new fromJobAssociationModalActions.SaveJobAssociationsSuccess();
        }),
        catchError(() => of(new fromJobAssociationModalActions.SaveJobAssociationsError())
        )
      )
    )
  );

  @Effect({ dispatch: false })
  closeJobAssociationModal$ = this.actions$.pipe(
    ofType(fromJobAssociationModalActions.CLOSE_JOB_ASSOCIATIONS_MODAL, fromJobAssociationModalActions.SAVE_JOB_ASSOCIATIONS_SUCCESS),
    mapTo(new fromJobAssociationModalActions.CloseJobAssociationsModal()),
    tap((action: fromJobAssociationModalActions.CloseJobAssociationsModal) => {
      this.windowCommunicationService.postMessage(action.type);
    })
  );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private store: Store<fromReducer.State>,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}

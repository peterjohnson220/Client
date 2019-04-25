import { Injectable} from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

import { ExchangeCompanyApiService } from '../../../../data/payfactors-api/peer';
import { ExchangeJobAssociation } from '../models';

import * as fromReducer from '../reducers';
import * as fromCompanyJobActions from '../actions/company-jobs.actions';
import * as fromExchangeJobActions from '../actions/exchange-jobs.actions';
import * as fromJobAssociationModalActions from '../actions/job-association-modal.actions';

@Injectable()
export class JobAssociationModalEffects {

  @Effect()
  saveJobAssociations$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobAssociationModalActions.SAVE_JOB_ASSOCIATIONS),
    // grab associations to add
    withLatestFrom(
      this.store.pipe(
        select(fromReducer.getExchangeJobAssociations)),
      (action, exchangeJobAssociations: ExchangeJobAssociation[]) => exchangeJobAssociations
    ),
    // grab associations to remove
    withLatestFrom(
      this.store.pipe(
        select(fromReducer.getPreviousAssociationsToDelete)),
        (exchangeJobAssociations: ExchangeJobAssociation[], associationsToDelete) => ({exchangeJobAssociations, associationsToDelete})
    ),
    switchMap( combined =>
      this.exchangeCompanyApiService.saveJobAssociations({
            AssociationsToAdd: combined.exchangeJobAssociations.map((associations => ({
              ExchangeId: associations.ExchangeId,
              ExchangeJobId: associations.ExchangeJobId,
              CompanyJobIds: associations.CompanyJobs.map(({ CompanyJobId }) => CompanyJobId) })
          )),
            AssociationsToRemove: combined.associationsToDelete
        }).pipe(map(() => {
          return new fromJobAssociationModalActions.SaveJobAssociationsSuccess();
        }),
        catchError(() => of(new fromJobAssociationModalActions.SaveJobAssociationsError()))
      )
    )
  );

  @Effect()
  openJobAssociationModal$ = this.actions$.pipe(
    ofType(fromJobAssociationModalActions.OPEN_JOB_ASSOCIATIONS_MODAL),
    mergeMap(() => [
      new fromCompanyJobActions.Load(),
      new fromExchangeJobActions.Load()
    ])
  );

  @Effect()
  reloadJam$ = this.actions$.pipe(
    ofType(fromJobAssociationModalActions.RELOAD_JOB_ASSOCIATIONS_MODAL),
    mergeMap(() => [
      new fromJobAssociationModalActions.ResetJobAssociationsModal(),
      new fromCompanyJobActions.Load(),
      new fromExchangeJobActions.Load()
    ])
  );

  @Effect()
  resetJobAssociationModal$ = this.actions$.pipe(
    ofType(fromJobAssociationModalActions.RESET_JOB_ASSOCIATIONS_MODAL),
    mergeMap(() => [
      new fromCompanyJobActions.Reset(),
      new fromExchangeJobActions.Reset()
    ])
  );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private store: Store<fromReducer.State>
  ) {}
}

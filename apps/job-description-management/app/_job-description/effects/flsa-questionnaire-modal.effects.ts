import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { AsyncStateObj } from 'libs/models/state';

import * as fromFlsaQuestionnaireModalActions from '../actions/flsa-questionnaire-modal.actions';
import * as fromFlsaQuestionnaireModalReducer from '../reducers';
import { FlsaQuestionnaireDetails } from '../models';

@Injectable()
export class FlsaQuestionnaireModalEffects {
  @Effect()
  loadFlsaQuestionnaire$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromFlsaQuestionnaireModalActions.LOAD_FLSA_QUESTIONNAIRE),
      switchMap((action: fromFlsaQuestionnaireModalActions.LoadFlsaQuestionnaire) =>
        this.jobDescriptionApiService.getFlsaQuestionnaire(action.payload.jobDescriptionId, action.payload.version, action.payload.isHistorical).pipe(
          map((response) => {
            return new fromFlsaQuestionnaireModalActions.LoadFlsaQuestionnaireSuccess(response);
          }),
          catchError(response => of(new fromFlsaQuestionnaireModalActions.LoadFlsaQuestionnaireError()))
        )
      ));

  @Effect()
  saveFlsaQuestionnaire: Observable<Action> = this.actions$
    .pipe(
      ofType(fromFlsaQuestionnaireModalActions.SAVE_FLSA_QUESTIONNAIRE),
      withLatestFrom(this.store.select(fromFlsaQuestionnaireModalReducer.getFlsaQuestionnaireAsync),
        (action: fromFlsaQuestionnaireModalActions.SaveFlsaQuestionnaire, questionnaire: AsyncStateObj<FlsaQuestionnaireDetails>) => ({action, questionnaire})),
      switchMap((data) =>
        this.jobDescriptionApiService.saveFlsaQuestionnaire(data.questionnaire.obj).pipe(
          map((response) => {
            return new fromFlsaQuestionnaireModalActions.SaveFlsaQuestionnaireSuccess(response);
          }),
          catchError(response => of(new fromFlsaQuestionnaireModalActions.SaveFlsaQuestionnaireError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private store: Store<fromFlsaQuestionnaireModalReducer.State>,
  ) {}
}

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';
import * as fromSurveyTitlesActions from '../actions';
import * as fromReducers from '../reducers';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class SurveyTitlesEffects {
  @Effect()
  saveCustomTitle$: Observable<Action> = this.actions$.pipe(
    ofType(fromSurveyTitlesActions.SAVE_CUSTOM_TITLE),
    withLatestFrom(
      this.store.select(fromReducers.getCustomSurveyTitleSaving),
      (action: fromSurveyTitlesActions.SaveCustomTitle) => {
        return {action};
      }
    ),
    switchMap(obj =>
    this.surveyLibraryApiService.saveCustomCompanySurveyTitle(obj.action.payload.surveyTitleId, obj.action.payload.request).pipe(
      switchMap(() => {
        return [
          new fromSurveyTitlesActions.SaveCustomTitleSuccess(obj.action.payload.request.CompanyId, obj.action.payload.surveyTitleId)
        ];
      }),
      catchError(error => of(new fromSurveyTitlesActions.SaveCustomTitleError()))
    ))
  );

    constructor(
      private actions$: Actions,
      private store: Store<fromReducers.State>,
      private surveyLibraryApiService: SurveyLibraryApiService
    ) { }
}

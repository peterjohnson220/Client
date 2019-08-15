import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';
import * as fromSurveyTitlesActions from '../actions';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

@Injectable()
export class SurveyTitlesEffects {
  @Effect()
  saveCustomTitle$: Observable<Action> = this.actions$.pipe(
    ofType(fromSurveyTitlesActions.SAVE_CUSTOM_TITLE),
    switchMap((action: fromSurveyTitlesActions.SaveCustomTitle) =>
    this.surveyLibraryApiService.saveCustomCompanySurveyTitle(action.payload.surveyTitleId, action.payload.request).pipe(
      mergeMap(() => {
        return [
          new fromSurveyTitlesActions.SaveCustomTitleSuccess()
        ];
      }),
      catchError(error => of(new fromSurveyTitlesActions.SaveCustomTitleError()))
    ))
  );

    constructor(
      private actions$: Actions,
      private surveyLibraryApiService: SurveyLibraryApiService
    ) { }
}

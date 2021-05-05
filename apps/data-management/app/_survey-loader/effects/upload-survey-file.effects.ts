import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { SurveyLoaderApiService } from 'libs/data/payfactors-api/data-loads';

import * as fromUploadSurveyFileActions from '../actions/upload-survey-file.actions';

@Injectable()
export class UploadSurveyFileEffects {

  @Effect()
  getWorksheetNames$ = this.actions$
    .pipe(
      ofType(fromUploadSurveyFileActions.GET_WORKSHEET_NAMES),
      switchMap((action: fromUploadSurveyFileActions.GetWorksheetNames) => {
        return this.surveyLoaderApiService.getWorksheetNames(action.payload)
          .pipe(
            map((response) => new fromUploadSurveyFileActions.GetWorksheetNamesSuccess({ worksheetNames: response })),
            catchError(() => of(new fromUploadSurveyFileActions.GetWorksheetNamesError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private surveyLoaderApiService: SurveyLoaderApiService
  ) {}
}

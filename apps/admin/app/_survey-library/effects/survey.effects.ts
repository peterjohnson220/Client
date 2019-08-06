import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';

import * as fromSurveyActions from '../actions/survey-actions';
import * as fromReducers from '../reducers';

@Injectable()
export class SurveyEffects {
    @Effect()
    loadData$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromSurveyActions.GET_SURVEY_DATA),
            switchMap((action: fromSurveyActions.GetSurveys) =>
                this.surveyLibraryApiService.getSurveyList(action.surveyId, action.searchText).pipe(
                    map((response: any) => {
                        return new fromSurveyActions.GetSurveysSuccess(response);
                    }),
                    catchError(error => of(new fromSurveyActions.GetSurveysFailed()))
                )
            ));

    @Effect()
    loadMapModalData$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromSurveyActions.GET_MAP_COMPANIES_MODAL_DATA),
            switchMap((action: fromSurveyActions.GetMapCompaniesModalData) =>
                this.surveyLibraryApiService.getMapCompaniesModalData(action.surveyId, action.searchText).pipe(
                    map((response: any) => {
                        return new fromSurveyActions.GetMapCompaniesModalDataSuccess(response);
                    }),
                    catchError(error => of(new fromSurveyActions.GetMapCompaniesModalDataFailed()))
                )
            ));

    constructor(
        private actions$: Actions,
        private store: Store<fromReducers.State>,
        private surveyLibraryApiService: SurveyLibraryApiService
    ) { }
}

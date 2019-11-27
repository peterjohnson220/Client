import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { CompanyApiService } from 'libs/data/payfactors-api/company/company-api.service';
import { SurveyApiService } from 'libs/data/payfactors-api/surveys/survey-api.service';
import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';
import { CompanyBaseInformation } from 'libs/models/company';
import { UdfDataResponse } from 'libs/models/payfactors-api/survey/response/udf-data-response.model';

import * as fromUdfManagerActions from '../actions/udf-manager.actions';
import * as fromUdfManagerReducer from '../reducers';

@Injectable()
export class UdfManagerEffects {
  @Effect()
  loadCompaniesList$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUdfManagerActions.LOAD_UDF_COMPANIES),
      switchMap((action: fromUdfManagerActions.LoadUdfCompanies) =>
        this.companyApiService.getCompanyBaseInformation(action.payload.searchTerm, action.payload.take).pipe(
          map((response: CompanyBaseInformation[]) => new fromUdfManagerActions.LoadUdfCompaniesSuccess(response)),
          catchError(error => of(new fromUdfManagerActions.LoadUdfCompaniesError()))
        )
      )
    );

  @Effect()
  getUdfSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUdfManagerActions.GET_SURVEY_UDFS),
      switchMap((action: fromUdfManagerActions.GetSurveyUdfs) =>
      this.surveyApiService.getUdfData(action.payload).pipe(
        map((response: UdfDataResponse) => {
          return new fromUdfManagerActions.GetSurveyUdfsSuccess(response);
        }),
        catchError(error => of(new fromUdfManagerActions.GetSurveyUdfsError()))
      ))
    );

  @Effect()
  saveUdfSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUdfManagerActions.SAVE_SURVEY_UDFS),
      switchMap((action: fromUdfManagerActions.SaveSurveyUdfs) =>
      this.surveyLibraryApiService.saveUdfSettings(action.companyId, action.udfSettings).pipe(
        map(() => {
          return new fromUdfManagerActions.SaveSurveyUdfsSuccess();
        }),
        catchError((error) => of(new fromUdfManagerActions.SaveSurveyUdfsError(error)))
      ))
    );

  @Effect()
  saveUdfSettingsSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUdfManagerActions.SAVE_SURVEY_UDFS_SUCCESS),
      withLatestFrom(
        this.store.select(fromUdfManagerReducer.getSelectedCompany),
        (action: fromUdfManagerActions.SaveSurveyUdfsSuccess, selectedCompany) => ({ action, selectedCompany })
      ),
      map((data) => new fromUdfManagerActions.GetSurveyUdfs(data.selectedCompany.CompanyId))
    );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService,
    private surveyApiService: SurveyApiService,
    private surveyLibraryApiService: SurveyLibraryApiService,
    private store: Store<fromUdfManagerReducer.State>
  ) {}
}

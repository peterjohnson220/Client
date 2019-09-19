import {Injectable} from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs/index';
import {Action} from '@ngrx/store';

import { CompanyDto } from 'libs/models/company';
import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromJobDescriptionVersionCompareActions from '../actions/job-description-version-compare.actions';
import { JobDescriptionApiService } from '../services/job-description-api.service';


@Injectable()
export class JobDescriptionVersionCompareEffects {
  @Effect()
  loadCompanyLogo$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionVersionCompareActions.LOAD_COMPANY_LOGO),
      switchMap((action: fromJobDescriptionVersionCompareActions.LoadCompanyLogo) =>
        this.companyApiService.get(action.payload).pipe(
          map((response: CompanyDto) => {
            return new fromJobDescriptionVersionCompareActions.LoadCompanyLogoSuccess(response.CompanyLogo);
          }),
          catchError(response => of(new fromJobDescriptionVersionCompareActions.LoadCompanyLogoError()))
        )
      ));

  @Effect()
  loadJobDescriptionComparison$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionVersionCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON),
      switchMap((action: fromJobDescriptionVersionCompareActions.LoadJobDescriptionComparison) =>
        this.jobDescriptionApiService.getVersionCompare(
          action.payload.jobDescriptionId,
          action.payload.revisionNumber,
          action.payload.previousRevisionNumber).pipe(
          map((response) => {
            return new fromJobDescriptionVersionCompareActions.LoadJobDescriptionComparisonSuccess(response);
          }),
          catchError(response => of(new fromJobDescriptionVersionCompareActions.LoadJobDescriptionComparisonError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}

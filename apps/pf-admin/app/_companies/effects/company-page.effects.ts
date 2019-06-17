import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, withLatestFrom, mergeMap, tap } from 'rxjs/operators';

import { CompanyApiService, UserApiService, CompanySettingsApiService, JobDescriptionApiService } from 'libs/data/payfactors-api';
import { CompanyDto } from 'libs/models';

import * as fromPfAdminMainReducer from '../reducers';
import * as fromCompanyPageActions from '../actions/company-page.actions';
import { CompanyPageHelper } from '../helpers';

@Injectable()
export class CompanyPageEffects {
  @Effect()
  getSystemUserGroups$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_SYSTEM_USER_GROUPS),
    switchMap(() =>
      this.companyApiService.getSystemUserGroups()
      .pipe(
        map((response) => new fromCompanyPageActions.GetSystemUserGroupsSuccess(response))
      )
    )
  );

  @Effect()
  getPfServicesReps$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_PF_SERVICES_REPS),
    switchMap(() =>
      this.userApiService.getPfServicesReps()
      .pipe(
        map((response) => new fromCompanyPageActions.GetPfServicesRepsSuccess(response))
      )
    )
  );

  @Effect()
  getPfCustomerSuccessManagers$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_PF_CUSTOMER_SUCCESS_MANAGERS),
    switchMap(() =>
      this.userApiService.getPfCustomerSuccessMgrs()
      .pipe(
        map((response) => new fromCompanyPageActions.GetPfCustomerSuccessManagersSuccess(response))
      )
    )
  );

  @Effect()
  getCompanyIndustries$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_COMPANY_INDUSTRIES),
    switchMap(() =>
      this.companyApiService.getCompanyIndustries()
      .pipe(
        map((response) => new fromCompanyPageActions.GetCompanyIndustriesSuccess(response))
      )
    )
  );

  @Effect()
  getCompanyClientTypes$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_COMPANY_CLIENT_TYPES),
    switchMap(() =>
      this.companyApiService.getCompanyClientTypes()
      .pipe(
        map((response) => new fromCompanyPageActions.GetCompanyClientTypesSuccess(response))
      )
    )
  );

  @Effect()
  getCompanyTiles$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_COMPANY_TILES),
    switchMap((action: fromCompanyPageActions.GetCompanyTiles) =>
      this.companyApiService.getCompanyTiles(action.payload)
      .pipe(
        map((response) => new fromCompanyPageActions.GetCompanyTilesSuccess(response)),
        catchError(() => of(new fromCompanyPageActions.GetCompanyTilesError()))
      )
    )
  );

  @Effect()
  getDefaultSettings$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_DEFAULT_SETTINGS),
    switchMap(() =>
      this.companySettingsApiService.getDefaultSettings()
      .pipe(
        map((response) => new fromCompanyPageActions.GetDefaultSettingsSuccess(response)),
        catchError(() => of(new fromCompanyPageActions.GetDefaultSettingsError()))
      )
    )
  );

  @Effect()
  getCompanyDataSets$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_COMPANY_DATA_SETS),
    switchMap((action: fromCompanyPageActions.GetCompanyDataSets) =>
      this.companyApiService.getCompanyDataSets(action.payload)
      .pipe(
        map((response) => new fromCompanyPageActions.GetCompanyDataSetsSuccess(response)),
        catchError(() => of(new fromCompanyPageActions.GetCompanyDataSetsError()))
      )
    )
  );

  @Effect()
  getCompositeFields$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_COMPOSITE_FIELDS),
    switchMap(() =>
      this.companyApiService.getCompositeFields()
      .pipe(
        map((response) => new fromCompanyPageActions.GetCompositeFieldsSuccess(response))
      )
    )
  );

  @Effect()
  getTokenUrl$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_PUBLIC_TOKEN_URL),
    switchMap((action: fromCompanyPageActions.GetPublicTokenUrl) =>
      this.jobDescriptionApiService.getPublicTokenUrl(action.payload)
      .pipe(
        map((response) => new fromCompanyPageActions.GetPublicTokenUrlSuccess(response)),
        catchError(() => of(new fromCompanyPageActions.GetPublicTokenUrlError()))
      )
    )
  );

  @Effect()
  saveCompany$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.SAVE_COMPANY),
    withLatestFrom(
      this.store.select(fromPfAdminMainReducer.getSelectedCompanyTiles),
      this.store.select(fromPfAdminMainReducer.getCompanySettings),
      this.store.select(fromPfAdminMainReducer.getSelectedDataSets),
      (action: fromCompanyPageActions.SaveCompany, tileIds, settings, countryCodes) =>
        ({ action, tileIds, settings, countryCodes })
    ),
    switchMap((data) =>
      this.companyApiService.insert(data.action.payload, data.tileIds, data.countryCodes)
      .pipe(
        mergeMap((company: CompanyDto ) => {
          const putSettingsRequest = CompanyPageHelper.buildCompanySettingsSaveRequest(company.CompanyId, data.settings);
          return [
            new fromCompanyPageActions.SaveCompanySuccess(),
            new fromCompanyPageActions.PutSettings(putSettingsRequest)
          ];
        }),
        catchError(() => of(new fromCompanyPageActions.SaveCompanyError()))
      )
    )
  );

  @Effect()
  putSettings$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.PUT_SETTINGS),
    switchMap((action: fromCompanyPageActions.PutSettings) =>
      this.companySettingsApiService.putSettings(action.payload)
      .pipe(
        map(() => new fromCompanyPageActions.PutSettingsSuccess()),
        catchError(() => of(new fromCompanyPageActions.PutSettingsError()))
      )
    )
  );

  @Effect({ dispatch: false })
  navigateToCompanies$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.PUT_SETTINGS_SUCCESS),
    tap(() => {
      this.router.navigate(['companies']);
    })
  );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService,
    private companySettingsApiService: CompanySettingsApiService,
    private userApiService: UserApiService,
    private jobDescriptionApiService: JobDescriptionApiService,
    private store: Store<fromPfAdminMainReducer.State>,
    private router: Router
  ) {}
}

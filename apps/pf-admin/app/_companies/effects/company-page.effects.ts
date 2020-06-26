import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, withLatestFrom, mergeMap, tap } from 'rxjs/operators';

import { CompanyApiService, UserApiService, CompanySettingsApiService, JobDescriptionApiService } from 'libs/data/payfactors-api';
import { CompanyDto } from 'libs/models';
import { TileNames } from 'libs/constants';

import * as fromPfAdminMainReducer from '../reducers';
import * as fromCompanyPageActions from '../actions/company-page.actions';
import { CompanyPageHelper } from '../helpers';

@Injectable()
export class CompanyPageEffects {

  @Effect()
  loadFormData$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.LOAD_FORM_DATA),
    mergeMap((action: fromCompanyPageActions.LoadFormData) => [
      new fromCompanyPageActions.GetSystemUserGroups(),
      new fromCompanyPageActions.GetPfAccountExecutives(),
      new fromCompanyPageActions.GetPfServicesReps(),
      new fromCompanyPageActions.GetPfJdmSrAssociates(),
      new fromCompanyPageActions.GetPfCustomerSuccessManagers(),
      new fromCompanyPageActions.GetCompanyIndustries(),
      new fromCompanyPageActions.GetCompanyClientTypes(),
      new fromCompanyPageActions.GetCompanyTiles(action.payload),
      new fromCompanyPageActions.GetCompanyDataSets(action.payload),
      new fromCompanyPageActions.GetCompositeFields()
    ])
  );

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
  getPfAccountExecutives$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_PF_ACCOUNT_EXECUTIVES),
    switchMap(() =>
      this.userApiService.getPfAccountExecutives()
      .pipe(
        map((response) => new fromCompanyPageActions.GetPfAccountExecutivesSuccess(response))
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
  getPfJdmSrAssociates$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_PF_JDM_SR_ASSOCIATES),
    switchMap(() =>
      this.userApiService.getPfJdmSrAssociates()
      .pipe(
        map((response) => new fromCompanyPageActions.GetPfJdmSrAssociatesSuccess(response))
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
      this.companyApiService.getCompanyTiles(action.payload.companyId)
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
      this.companyApiService.getCompanyDataSets(action.payload.companyId)
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
  checkJDMEnabled$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.CHECK_JDM_ENABLED),
    withLatestFrom(
      this.store.select(fromPfAdminMainReducer.getCompanyTiles),
      (action: fromCompanyPageActions.CheckJDMEnabled, tiles) => ({action, tiles})
    ),
    map((data) => {
      const jdmEnabled = data.tiles.some(tile => tile.TileName === TileNames.JobDescriptions && tile.Checked);
      if (jdmEnabled) {
        return new fromCompanyPageActions.GetPublicTokenUrl(data.action.payload);
      }
      return { type: 'No Action' };
    })
  );

  @Effect()
  getTokenUrl$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_PUBLIC_TOKEN_URL),
    switchMap((action: fromCompanyPageActions.GetPublicTokenUrl) =>
      this.jobDescriptionApiService.getPublicTokenUrl(action.payload.companyId)
      .pipe(
        map((response) => new fromCompanyPageActions.GetPublicTokenUrlSuccess(response)),
        catchError(() => of(new fromCompanyPageActions.GetPublicTokenUrlError()))
      )
    )
  );

  @Effect()
  createCompany$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.CREATE_COMPANY),
    withLatestFrom(
      this.store.select(fromPfAdminMainReducer.getSelectedCompanyTiles),
      this.store.select(fromPfAdminMainReducer.getSelectedCompanyMarketingTiles),
      this.store.select(fromPfAdminMainReducer.getCompanySettings),
      this.store.select(fromPfAdminMainReducer.getSelectedDataSets),
      (action: fromCompanyPageActions.CreateCompany, tileIds, marketingTileIds, settings, countryCodes) =>
        ({ action, tileIds, marketingTileIds, settings, countryCodes })
    ),
    switchMap((data) =>
      this.companyApiService.insert(data.action.payload, data.tileIds, data.marketingTileIds, data.countryCodes)
      .pipe(
        mergeMap((company: CompanyDto ) => {
          const putSettingsRequest = CompanyPageHelper.buildCompanySettingsSaveRequest(company.CompanyId, data.settings);
          return [
            new fromCompanyPageActions.CreateCompanySuccess(),
            new fromCompanyPageActions.PutSettings(putSettingsRequest)
          ];
        }),
        catchError(() => of(new fromCompanyPageActions.CreateCompanyError()))
      )
    )
  );

  @Effect()
  saveCompany$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.SAVE_COMPANY),
    withLatestFrom(
      this.store.select(fromPfAdminMainReducer.getSelectedCompanyTiles),
      this.store.select(fromPfAdminMainReducer.getSelectedCompanyMarketingTiles),
      this.store.select(fromPfAdminMainReducer.getCompanySettings),
      this.store.select(fromPfAdminMainReducer.getSelectedDataSets),
      (action: fromCompanyPageActions.SaveCompany, tileIds, marketingTileIds, settings, countryCodes) =>
        ({ action, tileIds, marketingTileIds, settings, countryCodes })
    ),
    switchMap((data) =>
      this.companyApiService.update(data.action.payload, data.tileIds, data.marketingTileIds, data.countryCodes)
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

  @Effect()
  navigateToCompanies$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.PUT_SETTINGS_SUCCESS),
    tap(() => {
      this.router.navigate(['companies']);
    }),
    map(() => new fromCompanyPageActions.Reset())
  );

  @Effect()
  getCompany$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_COMPANY),
    switchMap((action: fromCompanyPageActions.GetCompany) =>
      this.companyApiService.get(action.payload.companyId)
      .pipe(
        map((response) => new fromCompanyPageActions.GetCompanySuccess(response)),
        catchError(() => of(new fromCompanyPageActions.GetCompanyError()))
      )
    )
  );

  @Effect()
  getCompanySetting$ = this.actions$
  .pipe(
    ofType(fromCompanyPageActions.GET_COMPANY_SETTINGS),
    switchMap((action: fromCompanyPageActions.GetCompanySettings) =>
      this.companySettingsApiService.getCompanySettings(action.payload.companyId)
      .pipe(
        map((response) => new fromCompanyPageActions.GetCompanySettingsSuccess(response)),
        catchError(() => of(new fromCompanyPageActions.GetCompanySettingsError()))
      )
    )
  );

  @Effect()
  getJobPricingLimitInfo$ = this.actions$
    .pipe(
      ofType(fromCompanyPageActions.GET_JOB_PRICING_LIMIT_INFO),
      switchMap((action: fromCompanyPageActions.GetJobPricingLimitInfo) =>
        this.companyApiService.getJobPricingLimitInfoByCompanyId(action.payload.companyId)
          .pipe(
            map((response) => new fromCompanyPageActions.SetJobPricingLimitInfo(response))
          )
      )
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

import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError } from 'rxjs/operators';

import { CompanyEmployeeApiService, CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { PayMarketApiService, CountryApiService, CurrencyApiService, LoaderFieldMappingsApiService } from 'libs/data/payfactors-api';
import * as fromRootState from 'libs/state/state';

import * as fromEmployeeManagementReducer from '../reducers';
import * as fromEmployeeManagementActions from '../actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class EmployeeManagementEffects {

  @Effect()
  loadCompanyJobs$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.LOAD_COMPANYJOBS),
      switchMap(() => {
          return this.companyJobApiService.getAll(['JobTitle', 'CompanyJobId', 'JobCode']).pipe(
            map((response) => {
              return new fromEmployeeManagementActions.LoadCompanyJobsSuccess(
                PayfactorsApiModelMapper.mapItemsToDropdownList(response, 'CompanyJobId', (item => {
                  return `${item['JobCode']} - ${item['JobTitle']}`;
                }))
              );
            }),
            catchError(() => of(new fromEmployeeManagementActions.LoadCompanyJobsError()))
          );
        }
      )
    );

  @Effect()
  loadPaymarkets$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.LOAD_PAYMARKETS),
      switchMap(() => {
          return this.paymarketsApiService.getAll(['CompanyPayMarketId', 'PayMarket']).pipe(
            map((response) => {
              return new fromEmployeeManagementActions.LoadPaymarketsSuccess(
                PayfactorsApiModelMapper.mapToDropdownList(response, 'CompanyPayMarketId', 'PayMarket')
              );
            }),
            catchError(() => of(new fromEmployeeManagementActions.LoadPaymarketsError()))
          );
        }
      )
    );

  @Effect()
  loadCountries$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.LOAD_COUNTRIES),
      switchMap(() => {
          return this.countryApiService.getAll().pipe(
            map((response) => {
              return new fromEmployeeManagementActions.LoadCountriesSuccess(
                PayfactorsApiModelMapper.mapToDropdownList(response, 'CountryCode', 'CountryName')
              );
            }),
            catchError(() => of(new fromEmployeeManagementActions.LoadCountriesError()))
          );
        }
      )
    );

  @Effect()
  loadCurrencies$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.LOAD_CURRENCIES),
      switchMap(() => {
          return this.currencyApiService.getCurrencies().pipe(
            map((response) => {
              return new fromEmployeeManagementActions.LoadCurrenciesSuccess(
                PayfactorsApiModelMapper.mapItemsToDropdownList(response, 'CurrencyCode', (item => {
                  return `${item['CurrencyCode']} - ${item['CurrencyName']}`;
                }))
              );
            }),
            catchError(() => of(new fromEmployeeManagementActions.LoadCurrenciesError()))
          );
        }
      )
    );

  @Effect()
  loadDepartments$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.LOAD_DEPARTMENTS),
      switchMap(() => {
          return this.companyEmployeeApiService.getDistinctDepartments().pipe(
            map((response) => {
              return new fromEmployeeManagementActions.LoadDepartmentsSuccess(response);
            }),
            catchError(() => of(new fromEmployeeManagementActions.LoadDepartmentsError()))
          );
        }
      )
    );

  @Effect()
  loadGradeCodes$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.LOAD_GRADE_CODES),
      switchMap((action: fromEmployeeManagementActions.LoadGradeCodes) => {
          return this.companyEmployeeApiService.getGradeCodes(action.payload.jobId, action.payload.paymarketId, action.payload.companyStructureId).pipe(
            map((response) => {
              return new fromEmployeeManagementActions.LoadGradeCodesSuccess(
                PayfactorsApiModelMapper.mapToDropdownList(response, 'Value', 'Text')
              );
            }),
            catchError(() => of(new fromEmployeeManagementActions.LoadGradeCodesError()))
          );
        }
      )
    );

  @Effect()
  loadStructureNames$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.LOAD_STRUCTURES),
      switchMap((action: fromEmployeeManagementActions.LoadStructures) => {
          return this.companyEmployeeApiService.getStructureNames(action.payload.jobId, action.payload.paymarketId).pipe(
            map((response) => {
              return new fromEmployeeManagementActions.LoadStructuresSuccess(
                PayfactorsApiModelMapper.mapToDropdownList(response, 'Value', 'Text')
              );
            }),
            catchError(() => of(new fromEmployeeManagementActions.LoadStructuresError()))
          );
        }
      )
    );

  @Effect()
  getCustomFields$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.GET_CUSTOM_FIELDS),
      switchMap((action: fromEmployeeManagementActions.GetCustomFields) => {
        return this.loaderFieldMappingsApiService.getCustomEmployeeFields(action.payload.companyId)
          .pipe(
            map((response) => new fromEmployeeManagementActions.GetCustomFieldsSuccess(response)),
            catchError(() => of(new fromEmployeeManagementActions.GetCustomFieldsError()))
          );
      })
    );

  @Effect()
  saveEmployee = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.SAVE_EMPLOYEE),
      switchMap((action: fromEmployeeManagementActions.SaveEmployee) => {
          return this.companyEmployeeApiService.createEmployee(action.payload).pipe(
            map(() => {
              return new fromEmployeeManagementActions.SaveEmployeeSuccess();
            }),
            catchError(() => of(new fromEmployeeManagementActions.SaveEmployeeError('There was an error processing this request.')))
          );
        }
      )
    );

  constructor(
    private actions$: Actions,
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromEmployeeManagementReducer.State>,
    private companyJobApiService: CompanyJobApiService,
    private paymarketsApiService: PayMarketApiService,
    private countryApiService: CountryApiService,
    private currencyApiService: CurrencyApiService,
    private companyEmployeeApiService: CompanyEmployeeApiService,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService
  ) {}
}

import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, switchMap, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import { CompanyEmployeeApiService, CompanyJobApiService } from 'libs/data/payfactors-api/company';
import {
  PayMarketApiService, CountryApiService, CurrencyApiService, LoaderFieldMappingsApiService,
  EntityKeysValidationApiService, TotalRewardsApiService
} from 'libs/data/payfactors-api';
import { ODataQuery } from 'libs/models/common';
import * as fromRootState from 'libs/state/state';
import { EmployeeRewardsDataRequest } from 'libs/models/payfactors-api/total-rewards/request';

import * as fromEmployeeManagementReducer from '../reducers';
import * as fromEmployeeManagementActions from '../actions';
import { PayfactorsApiModelMapper } from '../helpers';
import { EmployeeRewardsDataService } from '../../../total-rewards/total-rewards-statement/services/employee-rewards-data.service';

@Injectable()
export class EmployeeManagementEffects {

  @Effect()
  loadCompanyJobs$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.LOAD_COMPANYJOBS),
      switchMap((action: fromEmployeeManagementActions.LoadCompanyJobs) => {
        const query: ODataQuery = {
          Fields: ['CompanyJobId', 'JobCode', 'JobTitle'],
          Top: action.payload.Limit,
          Skip: action.payload.Skip || 0,
          OrderBy: 'JobCode'
        };
        if (action.payload.SearchTerm) {
          query.Filter = `contains(JobCode,'${action.payload.SearchTerm}') or contains(JobTitle,'${action.payload.SearchTerm}')`;
        }
        return this.companyJobApiService.getAll(query).pipe(
          map((response) => {
            const jobs = PayfactorsApiModelMapper.mapCompanyJobsToJobs(response);
            if (action.payload.Skip) {
              return new fromEmployeeManagementActions.LoadMoreCompanyJobsSuccess({ jobs: jobs, moreData: jobs.length === action.payload.Limit });
            } else {
              return new fromEmployeeManagementActions.LoadCompanyJobsSuccess({ jobs: jobs, moreData: jobs.length === action.payload.Limit });
            }
          }),
          catchError(() => of(new fromEmployeeManagementActions.LoadCompanyJobsError()))
        );
      }
    )
  );

  @Effect()
  loadCompanyJobsById$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.LOAD_COMPANYJOB_BY_ID),
      switchMap((action: fromEmployeeManagementActions.LoadCompanyJobById) => {
        const query: ODataQuery = {
          Fields: ['CompanyJobId', 'JobCode', 'JobTitle'],
          Filter: `CompanyJobId eq ${action.payload}`
        };
        return this.companyJobApiService.getAll(query).pipe(
          map((response) => {
            const jobs = PayfactorsApiModelMapper.mapCompanyJobsToJobs(response);
            return new fromEmployeeManagementActions.LoadCompanyJobsSuccess({ jobs: jobs, moreData: false });
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
        return this.companyEmployeeApiService.getStructureNames(action.payload.jobId, action.payload.paymarketId, action.payload.employeeId)
          .pipe(
            map((response) => {
              return new fromEmployeeManagementActions.LoadStructuresSuccess(
                PayfactorsApiModelMapper.mapEmployeeModalStructuresReponsesToStructures(response)
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

  @Effect()
  updateEmployee$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.UPDATE_EMPLOYEE),
      switchMap((action: fromEmployeeManagementActions.UpdateEmployee) => {
        return this.companyEmployeeApiService.patch(action.payload)
          .pipe(
            map((response) => new fromEmployeeManagementActions.SaveEmployeeSuccess()),
            catchError(() => of(new fromEmployeeManagementActions.SaveEmployeeError('There was an error processing this request.')))
          );
      })
    );

  @Effect()
  editEmployee$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.EDIT_EMPLOYEE),
      mergeMap((action: fromEmployeeManagementActions.EditEmployee) => {
        return [
          new fromEmployeeManagementActions.ShowEmployeeForm(true),
          new fromEmployeeManagementActions.GetEmployee({
            companyEmployeeId: action.payload.companyEmployeeId
          })
        ];
      })
    );

  @Effect()
  getEmployee$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.GET_EMPLOYEE),
      switchMap((action: fromEmployeeManagementActions.GetEmployee) => {
        return this.companyEmployeeApiService.get(action.payload.companyEmployeeId)
          .pipe(
            map((response) => new fromEmployeeManagementActions.GetEmployeeSuccess(response)),
            catchError(() => of(new fromEmployeeManagementActions.GetEmployeeError()))
          );
      })
    );

  @Effect()
  validateEmployeeKeys$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.VALIDATE_EMPLOYEE_KEYS),
      switchMap((action: fromEmployeeManagementActions.ValidateEmployeeKeys) => {
        return this.entityKeysValidationApiService.validateEmployeeKeys(action.payload)
          .pipe(
            map(response => {
              const validation = PayfactorsApiModelMapper.mapEntityKeyFieldsResponseToEmployeeValidation(response, action.payload);
              return new fromEmployeeManagementActions.ValidateEmployeeKeysSuccess(validation);
            }),
            catchError(() => of(new fromEmployeeManagementActions.ValidateEmployeeKeysError('There was an error validating employee')))
          );
      })
    );

  @Effect()
  validateEmployeeKeysSuccess$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.VALIDATE_EMPLOYEE_KEYS_SUCCESS),
      map((action: fromEmployeeManagementActions.ValidateEmployeeKeysSuccess) => {
        if (action.payload.IsValid) {
          if (!!action.payload.Employee.CompanyEmployeeId) {
            return new fromEmployeeManagementActions.UpdateEmployee(action.payload.Employee);
          } else {
            return new fromEmployeeManagementActions.SaveEmployee(action.payload.Employee);
          }
        }
        return { type: 'No Action' };
      })
    );

  @Effect()
  getTotalRewardsStatement$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.GET_TOTAL_REWARDS_STATEMENT),
      withLatestFrom(this.store.pipe(select(fromEmployeeManagementReducer.getTotalRewardsStatementId)),
        (action, statementId) => ({action, statementId})),
      switchMap((data) => {
        return this.totalRewardsApiService.getStatementFromId(data.statementId.obj).pipe(
          map((response) => {
            return new fromEmployeeManagementActions.GetTotalRewardsStatementSuccess(response);
          }),
          catchError(() => of(new fromEmployeeManagementActions.GetTotalRewardsStatementError()))
        );
      })
    );

  @Effect()
  getEmployeeRewardsData$ = this.actions$.pipe(
    ofType(fromEmployeeManagementActions.GET_EMPLOYEE_TOTAL_REWARDS_DATA),
    switchMap((action: fromEmployeeManagementActions.GetEmployeeTotalRewardsData) => {
      const request: EmployeeRewardsDataRequest = {
        CompanyEmployeeId: action.payload.companyEmployeeId,
        StatementId: action.payload.statementId
      };
      return this.companyEmployeeApiService.getBenefits(request).pipe(
        map((response) => {
          return new fromEmployeeManagementActions.GetEmployeeTotalRewardsDataSuccess(EmployeeRewardsDataService.mapEmployeeRewardsDataDateFields(response));
        }),
        catchError(() => of(new fromEmployeeManagementActions.GetEmployeeTotalRewardsDataError()))
      );
    })
  );

  @Effect()
  getTotalRewardsStatementId$ = this.actions$.pipe(
    ofType(fromEmployeeManagementActions.GET_TOTAL_REWARDS_STATEMENT_ID),
    switchMap((action: fromEmployeeManagementActions.GetTotalRewardsStatementId) => {
      return this.totalRewardsApiService.getStatementIdByCompanyEmployeeId(action.payload.companyEmployeeId).pipe(
        map((response) => {
          return new fromEmployeeManagementActions.GetTotalRewardsStatementIdSuccess({ statementId: response });
        }),
        catchError(() => of(new fromEmployeeManagementActions.GetTotalRewardsStatementIdError()))
      );
    })
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
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService,
    private entityKeysValidationApiService: EntityKeysValidationApiService,
    private totalRewardsApiService: TotalRewardsApiService
  ) {}
}

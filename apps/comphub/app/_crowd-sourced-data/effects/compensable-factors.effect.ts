import { Injectable } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ComphubCrowdSourcedApiService } from 'libs/data/payfactors-api/comphub';

import * as fromComphubCrowdSourcedDataReducer from '../reducers';
import * as fromComphubCsdReducer from '../reducers';
import * as fromComphubSharedReducer from '../../_shared/reducers';
import * as fromCompensableFactorsActions from '../actions/compensable-factors.actions';
import * as fromComphubPageActions from '../../_shared/actions/comphub-page.actions';
import { CompensableFactorsConstants } from '../../_shared/constants/compensable-factors-constants';
import { generateDefaultEducationTypes, generateDefaultSupervisorRole, generateDefaultYearsExperience } from '../data';
import { CompensableFactorDataMapper } from '../helpers';

@Injectable()
export class CompensableFactorsEffect {

  @Effect()
  getCompensableFactors$ = this.actions$
    .pipe(
      ofType(
        fromCompensableFactorsActions.GET_ALL_COMPENSABLE_FACTORS
      ),
      withLatestFrom(
        this.sharedStore.select(fromComphubSharedReducer.getSelectedJobData),
        this.sharedStore.select(fromComphubSharedReducer.getSelectedPaymarket),
        this.sharedStore.select(fromComphubSharedReducer.getWorkflowContext),
        (action: fromCompensableFactorsActions.GetAllCompensableFactors, selectedJob, selectedPaymarket, workflowContext) =>
          ({ action, selectedJob, selectedPaymarket, workflowContext })
      ),
      switchMap((data) => {
          return this.comphubCSDApiService.getCompensableFactors({
            JobTitle: data.selectedJob.JobTitle,
            Country: data.workflowContext.activeCountryDataSet.CountryName,
            PaymarketId: data?.selectedPaymarket.CompanyPayMarketId
          }).pipe(
            map((response) => {
              return new fromCompensableFactorsActions.GetAllCompensableFactorsSuccess(
                CompensableFactorDataMapper.getCompensableFactorDataMap(response));
            }),
            catchError(() => of(new fromCompensableFactorsActions.GetAllCompensableFactorsError()))
          );
        }
      ));

  @Effect()
  getCompensableFactorsSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      fromCompensableFactorsActions.GET_ALL_COMPENSABLE_FACTORS_SUCCESS
    ),
    switchMap(() => {
      const actions = [];

      // Default Education types
      actions.push(new fromCompensableFactorsActions.AddDataToCompensableFactorsList({
          compensableFactor: CompensableFactorsConstants.EDUCATION,
          Data: generateDefaultEducationTypes()
        }
      ));
      // Get Education types
      actions.push(new fromCompensableFactorsActions.GetEducationTypes());

      // Default Years of experience
      actions.push(new fromCompensableFactorsActions.AddDataToCompensableFactorsList({
          compensableFactor: CompensableFactorsConstants.YEARS_EXPERIENCE,
          Data: generateDefaultYearsExperience()
        }
      ));

      // Default Supervisory role
      actions.push(new fromCompensableFactorsActions.AddDataToCompensableFactorsList({
          compensableFactor: CompensableFactorsConstants.SUPERVISORY_ROLE,
          Data: generateDefaultSupervisorRole()
        }
      ));

      return actions;
    })
  );

  @Effect()
  getEducationTypes$ = this.actions$
    .pipe(
      ofType(fromCompensableFactorsActions.GET_EDUCATION_TYPES),
      withLatestFrom(
        this.sharedStore.select(fromComphubCsdReducer.getCompensableFactors),
        this.sharedStore.select(fromComphubSharedReducer.getSelectedPaymarket),
        (action: fromCompensableFactorsActions.GetEducationTypes, compensableFactors, selectedPayMarket) =>
          ({ action, compensableFactors, selectedPayMarket })
      ),
      switchMap((data) => {
        return this.comphubCSDApiService.getCrowdSourcedEducationTypes()
          .pipe(
            mergeMap((response) => {
              const actions = [];

              const educationData = cloneDeep(data.compensableFactors['Education']);
              response.map(x => educationData.push({ Name: x.Name, Data: null, Selected: false }));
              actions.push(new fromCompensableFactorsActions.AddDataToCompensableFactorsList({
                  compensableFactor: CompensableFactorsConstants.EDUCATION,
                  Data: educationData
                }
              ));

              actions.push(new fromCompensableFactorsActions.GetEducationTypesSuccess());

              // We need to init pricing only if we choose pay market
              if (data.selectedPayMarket.CompanyPayMarketId != null) {
                actions.push(new fromCompensableFactorsActions.InitJobInitialPricing());
              }

              return actions;
            }),
            catchError(error => of(
              new fromCompensableFactorsActions.GetEducationTypesError(),
              new fromComphubPageActions.HandleApiError(error)))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubCrowdSourcedDataReducer.State>,
    private sharedStore: Store<fromComphubSharedReducer.State>,
    private comphubCSDApiService: ComphubCrowdSourcedApiService,
  ) {}
}

import { Injectable } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubCrowdSourcedApiService } from 'libs/data/payfactors-api/comphub';

import * as fromComphubCrowdSourcedDataReducer from '../reducers';
import * as fromComphubSharedReducer from '../../_shared/reducers';
import * as fromCompensableFactorsActions from '../actions/compensable-factors.actions';
import { CompensableFactorDataMapper } from '../helpers';
import * as fromComphubPageActions from '../../_shared/actions/comphub-page.actions';
import { CompensableFactorsConstants } from '../constants/compensable-factors-constants';
import { generateDefaultEducationTypes, generateDefaultSupervisorRole, generateDefaultYearsExperience } from '../data';
import * as fromComphubCsdReducer from '../reducers';

@Injectable()
export class CompensableFactorsEffect {

  @Effect()
  getCompensableFactors = this.actions$
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
          })
            .pipe(
              mergeMap((response) => {
                const actions = [];
                actions.push(new fromCompensableFactorsActions.GetAllCompensableFactorsSuccess(
                  CompensableFactorDataMapper.getCompensableFactorDataMap(response)));

                actions.push(new fromCompensableFactorsActions.AddDataToCompensableFactorsList({
                    compensableFactor: CompensableFactorsConstants.YEARS_EXPERIENCE,
                    Data: generateDefaultYearsExperience()
                  }
                ));

                actions.push(new fromCompensableFactorsActions.AddDataToCompensableFactorsList({
                    compensableFactor: CompensableFactorsConstants.EDUCATION,
                    Data: generateDefaultEducationTypes()
                  }
                ));
                // Get education types
                actions.push(new fromCompensableFactorsActions.GetEducationTypes());

                actions.push(new fromCompensableFactorsActions.AddDataToCompensableFactorsList({
                    compensableFactor: CompensableFactorsConstants.SUPERVISORY_ROLE,
                    Data: generateDefaultSupervisorRole()
                  }
                ));

                return actions;
              }),
              catchError((error) => of(new fromCompensableFactorsActions.GetAllCompensableFactorsError()))
            );
        }
      ));

  @Effect()
  getEducationTypes = this.actions$
    .pipe(
      ofType(fromCompensableFactorsActions.GET_EDUCATION_TYPES),
      withLatestFrom(
        this.sharedStore.select(fromComphubCsdReducer.getCompensableFactors),
        (action: fromCompensableFactorsActions.GetEducationTypes, compensableFactors) =>
          ({ action, compensableFactors })
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

import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import {
  JobDescriptionAppliesToItemResponse
} from 'libs/models/payfactors-api/job-description/response/job-description-appliesto-item-response.model';
import {
  AppliesToAttributesExistResponse
} from 'libs/models/payfactors-api/job-description/response/applies-to-attributes-exist-response.model';

import * as fromJobDescriptionAppliesToActions from 'libs/features/job-description-management/actions/job-description-appliesto.actions';
import * as fromJobDescriptionAppliesToReducer from 'libs/features/job-description-management/reducers';
import { PayfactorsApiModelMapper } from 'libs/features/job-description-management/helpers';

@Injectable()
export class JobDescriptionAppliesToEffects {
  @Effect()
  getAppliesToAttributesExist$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionAppliesToActions.GET_APPLIES_TO_ATTRIBUTES_EXIST),
      switchMap((action: fromJobDescriptionAppliesToActions.GetAppliesToAttributesExist) => {
          return this.jobDescriptionApiService.appliesToAttributesExist(action.payload.JobDescriptionId, action.payload.Request).pipe(
            map((response: AppliesToAttributesExistResponse) => {
              const mappedResponse = PayfactorsApiModelMapper.mapAppliesToAttributesExistResponseToAppliesToAttributesExist(response);
              mappedResponse.JobDescriptionAppliesTo = action.payload.Request.JobDescriptionAppliesTo;

              return new fromJobDescriptionAppliesToActions.GetAppliesToAttributesExistSuccess(mappedResponse);
            }),
            catchError(response => of(new fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesToError()))
          );
        }
      ));

  @Effect()
  loadJobDescriptionAppliesTo$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionAppliesToActions.LOAD_JOB_DESCRIPTION_APPLIESTO),
      switchMap((action: fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesTo) => {
          return this.jobDescriptionApiService.getAppliesTo().pipe(
            map((response: JobDescriptionAppliesToItemResponse[]) => {
              const appliesToItemList = PayfactorsApiModelMapper.mapJDAppliesToItemResponseListToJDAppliesToItemList(response);
              return new fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesToSuccess(appliesToItemList);
            }),
            catchError(response => of(new fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesToError()))
          );
        }
      ));

  @Effect()
  loadJobDescriptionAppliesToValues$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionAppliesToActions.LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES),
      switchMap((action: fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesToValues) => {
          return this.jobDescriptionApiService.getAppliesToValue(action.payload.SearchTerm).pipe(
            map((response: string[]) => {
              return new fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesToValuesSuccess(response);
            }),
            catchError(response => of(new fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesToValuesError()))
          );
        }
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private store: Store<fromJobDescriptionAppliesToReducer.State>,
  ) {}
}

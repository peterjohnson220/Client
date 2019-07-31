import { Injectable } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ListAreaColumnResponse } from 'libs/models/payfactors-api/user-profile/response';
import { UserProfileApiService } from 'libs/data/payfactors-api/user';
import { MappingHelper } from 'libs/core/helpers';

import * as fromJobRangeModelingGridActions from '../actions/job-range-modeling-grid.actions';

@Injectable()
export class JobRangeModelingGridEffects {
  @Effect()
  getListAreaColumns$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobRangeModelingGridActions.LOAD_LIST_AREA_COLUMNS),
      switchMap((action: fromJobRangeModelingGridActions.LoadListAreaColumns) =>
        this.userProfileApiService.getListAreaColumns(action.payload).pipe(
          map((response: ListAreaColumnResponse[]) => {
            const listAreaColumnList =  MappingHelper.mapListAreaColumnResponseListToListAreaColumnList(response);
            return new fromJobRangeModelingGridActions.LoadListAreaColumnsSuccess(listAreaColumnList);
          }),
          catchError(response => of(new fromJobRangeModelingGridActions.LoadListAreaColumnsError()))
        )
      ));

  @Effect()
  saveListAreaColumns$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobRangeModelingGridActions.SAVE_LIST_AREA_COLUMNS),
      switchMap((action: fromJobRangeModelingGridActions.SaveListAreaColumns) => {
          const newRequest = cloneDeep(action.payload);
          newRequest.Columns = MappingHelper.mapListAreaColumnListToListAreaColumnRequestList(newRequest.Columns);

          return this.userProfileApiService.saveListAreaColumns(newRequest).pipe(
            map((response: number) => {
              return new fromJobRangeModelingGridActions.SaveListAreaColumnsSuccess({ ListAreaColumns: action.payload.Columns });
            }),
            catchError(response => of(new fromJobRangeModelingGridActions.SaveListAreaColumnsError()))
          );
        }
      ));

  constructor(
    private actions$: Actions,
    private userProfileApiService: UserProfileApiService
  ) {
  }
}

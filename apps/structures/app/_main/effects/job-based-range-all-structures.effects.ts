import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { StructuresApiService } from 'libs/data/payfactors-api/structures';

import * as fromStructuresActions from '../actions/structures.actions';
import * as fromJobBasedRangeAllStructuresActions from '../actions/job-based-range-all-structures.actions';

@Injectable()
export class JobBasedRangeAllStructuresEffects {
  @Effect()
  getCompanyStructures$ = this.action$
    .pipe(
      ofType(fromJobBasedRangeAllStructuresActions.GET_COMPANY_STRUCTURE_VIEWS),
      switchMap(() => {
        return this.structuresApiService.getCompanyStructuresListViewData()
          .pipe(
            mergeMap((response) => {
              const actions = [];
              actions.push(new fromJobBasedRangeAllStructuresActions.GetCompanyStructureViewsSuccess(response));
              actions.push(new fromStructuresActions.GetCompanyStructuresSuccess(response));
              return actions;
            }),
            catchError(() => of(new fromJobBasedRangeAllStructuresActions.GetCompanyStructureViewsError()))
          );
      })
    );

  constructor(
    private action$: Actions,
    private structuresApiService: StructuresApiService) {
  }
}

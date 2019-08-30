import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

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
              const structures = response.map(sv => sv.Structure);
              actions.push(new fromJobBasedRangeAllStructuresActions.GetCompanyStructureViewsSuccess(response));
              actions.push(new fromStructuresActions.GetCompanyStructuresSuccess(structures));
              return actions;
            }),
            catchError(() => of(new fromJobBasedRangeAllStructuresActions.GetCompanyStructureViewsError()))
          );
      })
    );
  @Effect()
  addStructuresFavorite$ = this.action$
    .pipe(
      ofType(fromJobBasedRangeAllStructuresActions.ADD_STRUCTURE_FAVORITE),
      map((action: fromJobBasedRangeAllStructuresActions.AddStructureFavorite) => action.payload),
      switchMap((companyStructureId: number) => {
        return this.structuresApiService.addStructuresFavorite(companyStructureId)
          .pipe(
            map((responseCompanyStructureId) =>
              new fromJobBasedRangeAllStructuresActions.AddStructureFavoriteSuccess(responseCompanyStructureId)),
            catchError(() => of(new fromJobBasedRangeAllStructuresActions.AddStructureFavoriteError(companyStructureId)))
          );
      })
    );

  @Effect()
  removeStructuresFavorite$ = this.action$
    .pipe(
      ofType(fromJobBasedRangeAllStructuresActions.REMOVE_STRUCTURE_FAVORITE),
      map((action: fromJobBasedRangeAllStructuresActions.RemoveStructureFavorite) => action.payload),
      switchMap((companyStructureId: number) => {
        return this.structuresApiService.removeStructuresFavorite(companyStructureId)
          .pipe(
            map((removedCompanyStructureId) =>
              new fromJobBasedRangeAllStructuresActions.RemoveStructureFavoriteSuccess(removedCompanyStructureId)),
            catchError(() => of(new fromJobBasedRangeAllStructuresActions.RemoveStructureFavoriteError(companyStructureId)))
          );
      })
    );


  constructor(
    private action$: Actions,
    private structuresApiService: StructuresApiService) {
  }
}

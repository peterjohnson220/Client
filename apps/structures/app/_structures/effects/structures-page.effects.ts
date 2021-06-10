import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';

import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';

import * as fromStructuresPageActions from '../actions/structures-page.actions';

@Injectable()
export class StructuresPageEffects {

  @Effect()
  deleteStructureModel$ = this.actions$
    .pipe(
      ofType(fromStructuresPageActions.DELETE_STRUCTURE_MODEL),
      switchMap((data: any) => {
        return this.structureRangeGroupApiService.deleteStructureModel(data.payload.rangeGroupIds).pipe(
          mergeMap(() => [
            new fromStructuresPageActions.DeleteStructureModelSuccess(),
            new fromPfDataGridActions.ClearSelections(data.payload.pageViewId),
            new fromPfDataGridActions.LoadData(data.payload.pageViewId),
            new fromStructuresPageActions.CloseDeletePayMarketModal()
          ]),
          catchError(() => {
            return of(new fromStructuresPageActions.DeleteStructureModelError());
          })
        );
      })
    );

  constructor(
    private actions$: Actions,
    private structureRangeGroupApiService: StructureRangeGroupApiService
  ) {}
}

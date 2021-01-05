import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, mergeMap, catchError, groupBy } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { PayfactorsApiModelMapper } from 'libs/ui/formula-editor';
import * as fromFieldsActions from 'libs/ui/formula-editor/actions/fields.actions';
import * as fromDataInsightsMainReducer from '../reducers';

@Injectable()
export class FieldsEffects {

  @Effect()
  getReportFields$ = this.action$
    .pipe(
      ofType(fromFieldsActions.GET_AVAILABLE_FIELDS_BY_TABLE),
      groupBy((action: fromFieldsActions.GetAvailableFieldsByTable) => action.payload.fieldId),
      mergeMap(fieldIdGroup => fieldIdGroup.pipe(
        switchMap((action: fromFieldsActions.GetAvailableFieldsByTable) => {
          return this.dataViewApiService.getAvailableFieldsByTable(action.payload.request)
            .pipe(
              mergeMap((response) => [
                  new fromFieldsActions.GetAvailableFieldsByTableSuccess({
                    fields: PayfactorsApiModelMapper.mapDataViewFieldsToFields(response), fieldId: action.payload.fieldId})
                ]
              ),
              catchError(() => of(new fromFieldsActions.GetAvailableFieldsByTableError({ fieldId: action.payload.fieldId})))
            );
        })
      ))
    );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}

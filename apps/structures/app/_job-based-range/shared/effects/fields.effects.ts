import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { PayfactorsApiModelMapper } from 'libs/features/formula-editor';
import * as fromFieldsActions from 'libs/features/formula-editor/actions/fields.actions';
import * as fromDataInsightsMainReducer from '../reducers';

@Injectable()
export class FieldsEffects {

  @Effect()
  getReportFields$ = this.action$
  .pipe(
    ofType(fromFieldsActions.GET_AVAILABLE_REPORT_FIELDS_BY_PAGE_VIEW_ID),
    switchMap((action: fromFieldsActions.GetAvailableReportFieldsByPageViewId) => {
      return this.dataViewApiService.getAvailableDataViewPricingFields(action.payload.pageViewId)
      .pipe(
        mergeMap((response) => [
            new fromFieldsActions.GetAvailableReportFieldsSuccess(
              PayfactorsApiModelMapper.mapDataViewFieldsToFields(response))
          ]
        ),
        catchError(() => of(new fromFieldsActions.GetAvailableReportFieldsError()))
      );
    })
  );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}

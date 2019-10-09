import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { NotificationsApiService } from 'libs/data/payfactors-api';
import * as fromDataInsightsExportActions from '../actions/data-views-export.action';

import { PayfactorsApiModelMapper } from '../helpers'
import { DataViewExportListItem } from '../models';

@Injectable()
export class DataViewsExportEffects {

  @Effect()
  getExportRecords$ = this.actions$
    .pipe(
      ofType(fromDataInsightsExportActions.GET_DATA_VIEWS_EXPORT_LIST_ITEMS),
      switchMap(() => {
        return this.notificationApiService.getDataViewsExports()
          .pipe(
            map((response) => {
              const dataViewsExportList: DataViewExportListItem[] = PayfactorsApiModelMapper.mapDataViewExportResponsesToDataViewExports(response);
              return new fromDataInsightsExportActions.GetDataViewsExportsListItemsSuccess(dataViewsExportList);
            }),
            catchError(() => of(new fromDataInsightsExportActions.GetDataViewsExportsListItemsError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private notificationApiService: NotificationsApiService
  ) {}
}

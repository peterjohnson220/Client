import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { NotificationsApiService } from 'libs/data/payfactors-api';

import * as fromDataViewExportActions from '../actions/data-views-export.action';
import { PayfactorsApiModelMapper } from '../helpers';
import { DataViewExport } from '../models';

@Injectable()
export class DataViewsExportEffects {

  @Effect()
  getDataViewExports$ = this.actions$
    .pipe(
      ofType(fromDataViewExportActions.GET_DATA_VIEW_EXPORTS),
      switchMap(() => {
        return this.notificationApiService.getDataViewsExports()
          .pipe(
            map((response) => {
              const dataViewsExportList: DataViewExport[] = PayfactorsApiModelMapper.mapDataViewExportResponsesToDataViewExports(response);
              return new fromDataViewExportActions.GetDataViewExportsSuccess(dataViewsExportList);
            }),
            catchError(() => of(new fromDataViewExportActions.GetDataViewExportsError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private notificationApiService: NotificationsApiService
  ) {}
}

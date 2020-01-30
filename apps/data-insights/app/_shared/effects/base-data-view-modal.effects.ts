import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';

import * as fromDataViewModalActions from '../actions/base-data-view-modal.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import { Entity } from '../../_shared/models';

@Injectable()
export class BaseDataViewModalEffects {

  @Effect()
  getBaseEntities$ = this.action$
  .pipe(
    ofType(fromDataViewModalActions.GET_BASE_ENTITIES),
    switchMap(() => {
      return this.dataViewApiService.getBaseEntities()
      .pipe(
        map((response) => {
          const baseEntities: Entity[] = PayfactorsApiModelMapper.mapDataViewEntityResponsesToEntities(response);
          return new fromDataViewModalActions.GetBaseEntitiesSuccess(baseEntities);
        }),
        catchError(() => of(new fromDataViewModalActions.GetBaseEntitiesError()))
      );
    })
  );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService
  ) {}
}

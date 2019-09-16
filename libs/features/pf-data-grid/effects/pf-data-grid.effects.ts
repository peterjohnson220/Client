import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromPfDataGridActions from '../actions/pf-data-grid.actions';
import { PfDataGridFieldModel } from 'libs/models';
import { DataGridService } from '../services/data-grid.service';
import { GridDataResult } from '@progress/kendo-angular-grid';


@Injectable()
export class PfDataGridEffects {
    constructor(private actions$: Actions,
        private dataGridService: DataGridService,
    ) { }

    @Effect()
    loadDataFields$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.LOAD_FIELDS),
            switchMap((action: fromPfDataGridActions.LoadFields) =>
                this.dataGridService.getFields(action.entity).pipe(
                    map((fields: PfDataGridFieldModel[]) => new fromPfDataGridActions.LoadFieldsSuccess(action.entity, fields)),
                    catchError(error => {
                        const msg = 'We encountered an error while loading the data fields.';
                        return of(new fromPfDataGridActions.HandleApiError(msg));
                    })
                )
            )
        );
    @Effect()
    loadData$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.LOAD_DATA),
            switchMap((action: fromPfDataGridActions.LoadData) =>
                this.dataGridService.getData(action.entity).pipe(
                    map((data: GridDataResult) => new fromPfDataGridActions.LoadDataSuccess(action.entity, data)),
                    catchError(error => {
                        const msg = 'We encountered an error while loading your data';
                        return of(new fromPfDataGridActions.HandleApiError(msg));
                    })
                )
            )
        );

}

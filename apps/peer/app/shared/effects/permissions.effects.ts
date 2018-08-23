import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import { PermissionApiService } from '../services/permissions.service';

import * as fromPermissionActions from '../actions/permissions.actions';

@Injectable()
export class PermissionsEffects {

    @Effect()
    loadExchangeAccess$: Observable<Action> = this.actions$
        .ofType(fromPermissionActions.LOAD_ACCESS_PERMISSIONS).pipe(
            switchMap((action: fromPermissionActions.LoadAccessPermissions) =>
                this.permissionApiService.getExchangeAccess().pipe(
                    map((res: number[]) => {
                        return new fromPermissionActions.LoadAccessPermissionsSuccess(res);
                    }),
                    catchError(error => of(new fromPermissionActions.LoadAccessPermissionsError()))
                )
            )
        );

    constructor(
        private actions$: Actions,
        private permissionApiService: PermissionApiService
    ) { }
}



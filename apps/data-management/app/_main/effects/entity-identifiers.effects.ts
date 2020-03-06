import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { IntegrationApiService } from 'libs/data/payfactors-api/integration';
import * as fromRootState from 'libs/state/state';

import * as fromEntityIdentifierActions from '../actions/entity-identifier.actions';
import { DBEntityType, FieldNames } from '../models';
import { EntityIdentifierViewModel, EntityIdentifierViewModelOptions } from '../models/entity-identifiers-view.model';
import * as fromReducers from '../reducers';

@Injectable()
export class EntityIdentifiersEffects {

    @Effect()
    getEmployeeIdentifiers$: Observable<Action> = this.actions$.pipe(
        ofType(fromEntityIdentifierActions.GET_EMPLOYEE_IDENTIFIERS),
        map((action: fromEntityIdentifierActions.GetEmployeeIdentifiers) => action.companyId),
        withLatestFrom(
            this.store.pipe(select(fromRootState.getUserContext)),
            this.store.pipe(select(fromReducers.getCustomEmployeeField)),
            (companyId, userContext, customFields) => {
                return { companyId, userContext, customFields};
            }),
        switchMap(obj => {
            return this.integrationApiService.GetEntityIdentifiers(obj.companyId, DBEntityType.CompanyEmployees, obj.userContext).pipe(
                map((r) => {
                    const viewMappedResponse = this.mapToViewModel(r, obj.customFields);
                    return new fromEntityIdentifierActions.GetEmployeeIdentifiersSuccess(viewMappedResponse);
                }),
                catchError(e => of(new fromEntityIdentifierActions.GetEmployeeIdentifiersFailed()))
            );
        })
    );

    @Effect()
    putEmployeeIdentifiers$: Observable<Action> = this.actions$.pipe(
        ofType(fromEntityIdentifierActions.PUT_EMPLOYEE_IDENTIFIERS),
        map((action: fromEntityIdentifierActions.PutEmployeeIdentifiers) => action),
        withLatestFrom(
            this.store.pipe(select(fromRootState.getUserContext)),
          this.store.pipe(select(fromReducers.getCustomEmployeeField)),
            (action, userContext, customFields) => {
                return { action, userContext, customFields };
            }),
        switchMap(obj => {
            return this.integrationApiService.PutEntityIdentifiers(obj.action.companyId, DBEntityType.CompanyEmployees, obj.userContext, obj.action.keyFields)
                .pipe(
                    map((r) => {
                        const viewMappedResponse = this.mapToViewModel(r, obj.customFields);
                        return new fromEntityIdentifierActions.PutEmployeeIdentifiersSuccess(viewMappedResponse);
                    }),
                    catchError(e => of(new fromEntityIdentifierActions.PutEmployeeIdentifiersFailed()))
                );
        })
    );


    private mapToViewModel(fields: string[], customFields: any[]): EntityIdentifierViewModel[] {

        const fieldOptions = EntityIdentifierViewModelOptions();

        if (customFields.length > 0 && customFields.find(field => field.Key === 'UdfChar1Name')) {
          const udf1 = customFields.find(field => field.Key === 'UdfChar1Name');
          const udfFieldOption = fieldOptions.find(field => field.DbColumn === FieldNames.UDF_CHAR_1);
          udfFieldOption.Field = udf1.Value;
          udfFieldOption.isDisabled = false;
        }

        if (!fields || fields.length === 0) {
            return fieldOptions;
        }

        fields.forEach(f => {
          const fieldOption = fieldOptions.find(a => a.DbColumn === f);

          if (fieldOption) {
            fieldOption.isChecked = true;
          }
        });

        return fieldOptions;
    }

    constructor(
        private actions$: Actions,
        private integrationApiService: IntegrationApiService,
        private store: Store<fromRootState.State>,
    ) { }
}

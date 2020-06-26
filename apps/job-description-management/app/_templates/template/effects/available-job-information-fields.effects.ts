import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api';
import { MessageHelper } from 'libs/core';

import * as fromTemplateActions from '../actions';
import { AvailableJobInformationField } from '../../../shared/models';

@Injectable()
export class AvailableJobInformationFieldsEffects {
    @Effect()
    loadAvailableJobInformationFields$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromTemplateActions.LOAD_AVAILABLE_JOB_INFORMATION_FIELDS),
        switchMap((action: fromTemplateActions.LoadAvailableJobInformationFields) => {
        return this.jobDescriptionTemplateApiService.getAvailableJobInformationFields().pipe(
            map((response: AvailableJobInformationField[]) => {
            return new fromTemplateActions.LoadAvailableJobInformationFieldsSuccess({availableJobInformationFields: response});
            }),
            catchError(response => of(new fromTemplateActions.LoadJobsByFamilyWithNoTemplateError(
                { errorMessage: MessageHelper.buildErrorMessage('Error loading available job information fields')}
            )))
        );
        }));

  constructor(
    private actions$: Actions,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService
  ) {}
}

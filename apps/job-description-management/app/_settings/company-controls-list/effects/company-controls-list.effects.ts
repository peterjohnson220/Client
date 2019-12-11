import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ControlType } from 'libs/models';
import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api/jdm';
import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromCompanyControlsListActions from '../actions/company-controls-list.actions';

@Injectable()
export class CompanyControlsListEffects {
  @Effect()
  loadLatestCompanyControls: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyControlsListActions.LOAD_COMPANY_CONTROLS),
      switchMap(() =>
        this.jobDescriptionManagementApiService.getLatestControls().pipe(
          map((response: ControlType[]) => {
            return new fromCompanyControlsListActions.LoadCompanyControlsSuccess(
              response
              // Filter out system content controls
              .filter(c => c.CompanyId)
              .sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending))
            );
          }),
          catchError(() => of(new fromCompanyControlsListActions.LoadCompanyControlsError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
  ) {}
}

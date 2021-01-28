import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CompanyApiService } from '../../../../data/payfactors-api/company';
import * as fromOrgDataNavigationLinkActions from '../actions/org-data-navigation-link.actions';


@Injectable()
export class OrgDataNavigationLinkEffects {

  @Effect()
  InitiateOrgDataExport$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOrgDataNavigationLinkActions.INITIATE_ORG_DATA_EXPORT),
      switchMap(() =>
        this.companyApiService.getOrganizationalData().pipe(
          map(() => new fromOrgDataNavigationLinkActions.InitiateOrgDataExportSuccess()),
          catchError(error => of(new fromOrgDataNavigationLinkActions.InitiateOrgDataExportError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService
  ) {}
}

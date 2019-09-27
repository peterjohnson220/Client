import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import { CompanyResourcesApiService } from 'libs/data/payfactors-api';


@Injectable()
export class CompanyResourcesPageEffects {

  @Effect()
  gettingCompanyResources$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyResourcesPageActions.GETTING_COMPANY_RESOURCES),
      switchMap(() =>
        this.resourcesApiService.getCompanyResources().pipe(
          map((response) => new fromCompanyResourcesPageActions.GettingCompanyResourcesSuccess(response)),
          catchError(error => of(new fromCompanyResourcesPageActions.GettingCompanyResourcesError(error)))
        ))
    );

  @Effect()
  addingCompanyResource$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE),
      switchMap((action: fromCompanyResourcesPageActions.AddingCompanyResource) =>
          this.resourcesApiService.addCompanyResource(action.payload).pipe(
              map((response) => new fromCompanyResourcesPageActions.AddingCompanyResourceSuccess(response)),
              catchError(error => of(new fromCompanyResourcesPageActions.AddingCompanyResourceError(error)))
          ))
    );

  @Effect()
  deletingCompanyResource$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE),
        switchMap((action: fromCompanyResourcesPageActions.DeletingCompanyResource) =>
            this.resourcesApiService.deleteCompanyResource(action.payload).pipe(
                map((response) => new fromCompanyResourcesPageActions.DeletingCompanyResourceSuccess(response)),
                catchError(error => of(new fromCompanyResourcesPageActions.DeletingCompanyResourceError(error)))
            ))
      );

  constructor(
    private actions$: Actions,
    private resourcesApiService: CompanyResourcesApiService,
  ) {}
}

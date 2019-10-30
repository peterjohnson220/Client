import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';
import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import { CompanyResourcesApiService } from 'libs/data/payfactors-api';
import { CompanyResource, CompanyResourceFolder } from '../models';

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
      switchMap((action: fromCompanyResourcesPageActions.AddingCompanyResource) => {
          return this.resourcesApiService.addCompanyResource(action.payload).pipe(
            mergeMap((response) => {
              const actions = [];

              if (!action.payload.Resource.CompanyResourcesFoldersId && action.payload.Resource.FolderName) {
                const folderName = action.payload.Resource.FolderName;
                const resource: CompanyResource = response;
                const newResourceFolder: CompanyResourceFolder = {
                  CompanyId: resource.CompanyId,
                  CompanyResources: [resource],
                  CompanyResourcesFoldersId: resource.CompanyResourcesFoldersId,
                  CreateDate: resource.CreateDate,
                  CreateUser: resource.CreateUser,
                  FolderName: folderName
                };
                actions.push(new fromCompanyResourcesPageActions.AddingCompanyResourceAndFolderSuccess(newResourceFolder));
              } else if (action.payload.Resource.CompanyResourcesFoldersId) {
                actions.push(new fromCompanyResourcesPageActions.AddingCompanyResourceToFolderSuccess(response));
              } else {
                actions.push(new fromCompanyResourcesPageActions.AddingCompanyResourceOrphanSuccess(response));
              }

              actions.push(new fromCompanyResourcesPageActions.AddingCompanyResourceSuccess());
              return actions;
            }),
            catchError(error => of(new fromCompanyResourcesPageActions.AddingCompanyResourceError(error)))
          );
        }
      )
    );

  @Effect()
  deletingCompanyResource$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE),
      switchMap((action: fromCompanyResourcesPageActions.DeletingCompanyResource) => {
        return this.resourcesApiService.deleteCompanyResource(action.payload).pipe(
          mergeMap(() => {
            return [new fromCompanyResourcesPageActions.DeletingCompanyResourceSuccess(action.payload)];
          }),
          catchError(error => of(new fromCompanyResourcesPageActions.DeletingCompanyResourceError(error)))
        );
      }
    )
    );

  @Effect()
  addingFolderToCompanyResources$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyResourcesPageActions.ADDING_FOLDER_TO_COMPANY_RESOURCES),
      switchMap((action: fromCompanyResourcesPageActions.AddingFolderToCompanyResources) =>
        this.resourcesApiService.addCompanyResourceFolder(action.payload).pipe(
          map((response) => new fromCompanyResourcesPageActions.AddingFolderToCompanyResourcesSuccess(response)),
          catchError((error) => of(new fromCompanyResourcesPageActions.AddingFolderToCompanyResourcesError(error)))
        ))
    );

  @Effect()
  deletingFolderFromCompanyResources$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyResourcesPageActions.DELETING_FOLDER_FROM_COMPANY_RESOURCES),
      switchMap((action: fromCompanyResourcesPageActions.DeletingFolderFromCompanyResources) =>
        this.resourcesApiService.deleteCompanyResourceFolder(action.payload).pipe(
            map(() => new fromCompanyResourcesPageActions.DeletingFolderFromCompanyResourcesSuccess(action.payload)),
            catchError(error => of(new fromCompanyResourcesPageActions.DeletingFolderFromCompanyResourcesError(error)))
        ))
    );

  constructor(
    private actions$: Actions,
    private resourcesApiService: CompanyResourcesApiService,
  ) {}
}

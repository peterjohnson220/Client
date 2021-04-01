import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';

import { CompanyResourcesApiService } from 'libs/data/payfactors-api';

import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import * as fromCompanyResourcesAddResourceActions from '../actions/company-resources-add-resource.actions';
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
              actions.push(new fromCompanyResourcesAddResourceActions.ClearCompanyResourcesUploadState());
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
          map(() => new fromCompanyResourcesPageActions.DeletingCompanyResourceSuccess(action.payload)),
          catchError(error => of(new fromCompanyResourcesPageActions.DeletingCompanyResourceError(error)))
        );
      }
    )
    );

  @Effect()
  deletingCompanyResourceFromCloud$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyResourcesAddResourceActions.DISCARD_COMPANY_RESOURCE),
      switchMap((action: fromCompanyResourcesAddResourceActions.DiscardCompanyResource) => {
        return this.resourcesApiService.removeCompanyResource(action.payload).pipe(
          map(() => new fromCompanyResourcesAddResourceActions.DiscardCompanyResourceSuccess()),
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

  @Effect()
  updateResourceName$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyResourcesPageActions.UPDATE_RESOURCE_TITLE),
      switchMap((action: fromCompanyResourcesPageActions.UpdateResourceTitle) => {
        return this.resourcesApiService.updateResourceTitle(action.payload.companyResourceId, action.payload.title).pipe(
          mergeMap(() => {
            const actions = [];
            actions.push(new fromCompanyResourcesPageActions.CloseRenameResourceModal());
            if (action.payload.companyResourceFolderId) {
              actions.push(new fromCompanyResourcesPageActions.UpdateResourceTitleWithFolderSuccess({
                companyResourceId: action.payload.companyResourceId,
                companyResourceFolderId: action.payload.companyResourceFolderId,
                title: action.payload.title
              }));
            }
            actions.push(new fromCompanyResourcesPageActions.UpdateResourceTitleSuccess({
              companyResourceId: action.payload.companyResourceId,
              title: action.payload.title
            }));
            return actions;
          }),
          catchError((error) => of(new fromCompanyResourcesPageActions.UpdateResourceTitleError()))
        );
      })
    );

  @Effect()
  updateFolderName$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyResourcesPageActions.UPDATE_FOLDER_NAME),
      switchMap((action: fromCompanyResourcesPageActions.UpdateFolderName) => {
        return this.resourcesApiService.updateFolderName(action.payload.companyResourcesFolderId, action.payload.folderName)
          .pipe(
            mergeMap(() => {
              const actions = [];
              actions.push(new fromCompanyResourcesPageActions.CloseRenameFolderModal);
              actions.push(new fromCompanyResourcesPageActions.UpdateFolderNameSuccess({
                companyResourcesFolderId: action.payload.companyResourcesFolderId,
                folderName: action.payload.folderName
              }));
              return actions;
            }),
            catchError((error: HttpErrorResponse) => {
              const errorMessage = error.status === 409
                ? 'Folder name already exists'
                : 'Error saving folder name';
              return of(new fromCompanyResourcesPageActions.UpdateFolderNameError(errorMessage));
            })
          );
      })
    );

  constructor(
    private actions$: Actions,
    private resourcesApiService: CompanyResourcesApiService,
  ) {}
}

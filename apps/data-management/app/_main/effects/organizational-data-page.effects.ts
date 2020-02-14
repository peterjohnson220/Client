import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ConfigurationGroupApiService, OrganizationalDataApiService } from 'libs/data/payfactors-api/organizational-data';
import {DataImportApiService} from 'libs/data/payfactors-api/integration/data-import';
import { ConfigurationGroup } from 'libs/models/data-loads';

import * as fromOrganizationalDataActions from '../actions/organizational-data-page.action';

@Injectable()
export class OrganizationalDataPageEffects {
  @Effect()
  getOrganizationalHeadersLink$: Observable<Action> = this.actions$.pipe(
    ofType(fromOrganizationalDataActions.GET_ORGANIZATIONAL_HEADERS_LINK),
    switchMap((action: fromOrganizationalDataActions.GetOrganizationalHeadersLink) =>
      this.organizationalDataApiService.getOrganizationalHeadersLink().pipe(
        map((link: string) => {
          return new fromOrganizationalDataActions.GetOrganizationalHeadersLinkSuccess(link);
        }),
        catchError(error => of(new fromOrganizationalDataActions.GetOrganizationalHeadersLinkError()))
      )
    )
  );

  @Effect()
  getConfigurationGroup$: Observable<Action> = this.actions$.pipe(
    ofType(fromOrganizationalDataActions.GET_CONFIGURATION_GROUPS),
    switchMap((action: fromOrganizationalDataActions.GetConfigGroups) =>
      this.configurationGroupApiService.getConfigurationGroups(action.companyId, action.loadType).pipe(
        map((configGroups: ConfigurationGroup[]) => {
          return new fromOrganizationalDataActions.GetConfigGroupsSuccess(configGroups);
        }),
        catchError(error => of(new fromOrganizationalDataActions.GetConfigGroupsFailed()))
      )
    )
  );

  @Effect()
  uploadData$: Observable<Action> = this.actions$.pipe(
    ofType(fromOrganizationalDataActions.UPLOAD_DATA),
    switchMap((action: fromOrganizationalDataActions.UploadData) =>
      this.dataImportApiService.sendFiles(action.payload.companyId, action.payload.fileUpload, action.payload.userContext).pipe(
        map((response: any) => {
          return new fromOrganizationalDataActions.UploadDataSuccess(true);
        }),
        catchError(error => of(new fromOrganizationalDataActions.UploadDataFailed()))
      )
    )
  );

  @Effect()
  SaveConfigurationGroup$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOrganizationalDataActions.SAVE_CONFIGURATION_GROUP),
      map((action: fromOrganizationalDataActions.SaveConfigGroup) => action.payload),
      switchMap(configurationGroup => {
        return this.configurationGroupApiService.saveConfigurationGroup(configurationGroup).pipe(
          map((response: ConfigurationGroup) => new fromOrganizationalDataActions.SaveConfigGroupSuccess(response)),
          catchError(error => of(new fromOrganizationalDataActions.SaveConfigGroupFailed()))
        );
      })
    );


  constructor(
    private actions$: Actions,
    private organizationalDataApiService: OrganizationalDataApiService,
    private configurationGroupApiService: ConfigurationGroupApiService,
    private dataImportApiService: DataImportApiService
  ) { }
}




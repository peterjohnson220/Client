import { Injectable } from '@angular/core';
import { Action, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { PermissionService } from 'libs/core/services/permission.service';
import { SettingsService } from 'libs/state/app-context/services';
import { Permissions, PermissionCheckEnum } from 'libs/constants';
import { CompanySettingsEnum } from 'libs/models';

import * as fromLoadAndExportFilesCardActions from '../actions/load-and-export-files-card.actions';
import { LoadAndExportFilesCardState } from '../reducers/load-and-export-files-card.reducer';

@Injectable()
export class LoadAndExportFilesCardEffects {
  @Effect()
  initLoadAndExportFilesCard$: Observable<Action> = this.actions$.pipe(
    ofType<fromLoadAndExportFilesCardActions.InitLoadAndExportFilesCard>(fromLoadAndExportFilesCardActions.INIT_LOAD_AND_EXPORT_FILES_CARD),
    withLatestFrom(
      this.settingsService.selectCompanySetting<string>(CompanySettingsEnum.ManualOrgDataLoadLink, 'string'),
      (action: fromLoadAndExportFilesCardActions.InitLoadAndExportFilesCard,
        manualOrgDataLoadLinkSetting) => {
          const canImportOrgData = manualOrgDataLoadLinkSetting === 'true';
        return {
          action,
          canImportOrgData
        };
      }),
    map((obj) => {
      const cardState: LoadAndExportFilesCardState = {
        canImportOrgData: obj.canImportOrgData,
        canExportOrgData: this.permissionService.CheckPermission([Permissions.CAN_DOWNLOAD_ORGANIZATIONAL_DATA], PermissionCheckEnum.Single),
        canExportPricingData: this.permissionService.CheckPermission([Permissions.CAN_DOWNLOAD_PRICING_DATA], PermissionCheckEnum.Single),
        canExportJobDescription: this.permissionService.CheckPermission([Permissions.CAN_DOWNLOAD_JOB_DESCRIPTION_DATA], PermissionCheckEnum.Single),
        canScheduleBulkExports: this.permissionService.CheckPermission([Permissions.SCHEDULE_JDM_BULK_EXPORT], PermissionCheckEnum.Single),
        loading: false
      };

      return new fromLoadAndExportFilesCardActions.InitLoadAndExportFilesCardSuccess(cardState);
    }),
    catchError(() => of(new fromLoadAndExportFilesCardActions.InitLoadAndExportFilesCardError()))
  );

  constructor(
    private actions$: Actions,
    private permissionService: PermissionService,
    private settingsService: SettingsService
  ) {}
}

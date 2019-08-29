import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { TableauReportApiService, UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';

import * as fromDataInsightsPageActions from '../actions/data-insights-page.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class DataInsightsPageEffects {

  @Effect()
  getStandardReports$ = this.actions$
    .pipe(
      ofType(fromDataInsightsPageActions.GET_STANDARD_REPORTS),
      switchMap(() => {
          return this.tableauReportApiService.getStandardReports().pipe(
            map((response) => {
              return new fromDataInsightsPageActions.GetStandardReportsSuccess(
                PayfactorsApiModelMapper.mapTableauReportResponsesToWorkbooks(response)
              );
            }),
            catchError(() => of(new fromDataInsightsPageActions.GetStandardReportsError()))
          );
        }
      )
    );

  @Effect()
  saveShowStandardReportsSectionSetting$ = this.actions$
  .pipe(
    ofType(fromDataInsightsPageActions.SAVE_STANDARD_REPORTS_DISPLAY_SETTING),
    switchMap((action: fromDataInsightsPageActions.SaveStandardReportsDisplaySetting) => {
      return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
        FeatureArea: 'DataInsights',
        SettingName: 'ShowStandardReportsSection',
        SettingValue: action.payload.settingValue.toString()
      })
      .pipe(
        map(() => new fromDataInsightsPageActions.SaveStandardReportsDisplaySettingSuccess()),
        catchError(() => of(new fromDataInsightsPageActions.SaveStandardReportsDisplaySettingError()))
      );
    })
  );

  @Effect()
  getShowStandardReportsSectionSetting$ = this.actions$
  .pipe(
    ofType(fromDataInsightsPageActions.GET_STANDARD_REPORTS_DISPLAY_SETTING),
    switchMap(() => {
      return this.uiPersistenceSettingsApiService.getUiPersistenceSetting('DataInsights', 'ShowStandardReportsSection')
        .pipe(
          map((response) => {
            const settingValue: boolean = response.hasOwnProperty('@odata.null') || response === 'true'
              ? true
              : false;
            return new fromDataInsightsPageActions.GetStandardReportsDisplaySettingSuccess({ settingValue });
          }),
          catchError(() => of(new fromDataInsightsPageActions.GetStandardReportsDisplaySettingError()))
        );
    })
  );

  constructor(
    private actions$: Actions,
    private tableauReportApiService: TableauReportApiService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService
  ) {}
}

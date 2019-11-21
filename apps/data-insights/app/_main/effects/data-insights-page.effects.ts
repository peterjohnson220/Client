import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import { TableauReportApiService } from 'libs/data/payfactors-api';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

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
    map((action: fromDataInsightsPageActions.SaveStandardReportsDisplaySetting) => {
      return new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
        FeatureArea: FeatureAreaConstants.DataInsights,
        SettingName: UiPersistenceSettingConstants.ShowStandardReportsSection,
        SettingValue: action.payload.settingValue.toString()
      });
    })
  );

  constructor(
    private actions$: Actions,
    private tableauReportApiService: TableauReportApiService
  ) {}
}

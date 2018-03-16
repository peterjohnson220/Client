import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import 'hammerjs';
import * as fromClientSettingsReducer from 'libs/core/reducers/client-settings.reducer';
import { Action, Store, ActionsSubject } from '@ngrx/store';
import * as fromClientSettingActions from 'libs/core/actions/client-settings.actions';
import { ClientSettingRequestModel } from 'libs/models/common/client-setting-request.model';
import * as fromTileGridReducer from '../../../reducers';
import * as fromTileGridActions from '../../../actions/tile-grid.actions';
import { Actions } from '@ngrx/effects';
import { TilePreviewChartWithCalendar } from '../../../models/tile-preview-chart-with-calendar.model';
import { SAVING_CLIENT_SETTING_SUCCESS } from 'libs/core/actions/client-settings.actions';


@Component({
  selector: 'pf-tile-preview-calendar-with-chart',
  templateUrl: './tile-preview-chart-with-calendar.component.html',
  styleUrls: [ './tile-preview-chart-with-calendar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartWithCalendarComponent implements OnInit {
  @Input() model: TilePreviewChartWithCalendar;
  selectedPricingEffectiveDate: any;

  constructor(private clientSettingsStore: Store<fromClientSettingsReducer.State>,
              private tileGridStore: Store<fromTileGridReducer.State>, private actions$: Actions,
              private actionsSubject: ActionsSubject) {
  }


  public chartData: any[] = [];

  showChartDetail = false;

  public seriesItemHighlightStyle: any = {
    opacity: 1,
    color: '#585858',
    border: '#000'
  };

  ngOnInit() {
    this.selectedPricingEffectiveDate = new Date(this.model.ComponentData[ 1 ].SelectedDate);
  }

  datePickerValueChanged() {
    const clientSettingRequest = {
      FeatureArea: 'Dashboard', SettingName: 'JobsTileEffectiveDate',
      SettingValue: this.selectedPricingEffectiveDate
    } as ClientSettingRequestModel;

    this.clientSettingsStore.dispatch(new fromClientSettingActions.SavingClientSetting
    (JSON.stringify(clientSettingRequest)));

    const actionSubjectSubscription = this.actionsSubject.filter(action => action.type === SAVING_CLIENT_SETTING_SUCCESS)
      .subscribe(() => {
          this.tileGridStore.dispatch(new fromTileGridActions.LoadingSingleTile(this.model.TileId));
          actionSubjectSubscription.unsubscribe();
        }
      );
  }
}

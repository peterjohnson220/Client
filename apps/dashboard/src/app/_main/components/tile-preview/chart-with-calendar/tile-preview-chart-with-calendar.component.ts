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
import 'rxjs/add/operator/filter';

@Component({
  selector: 'pf-tile-preview-calendar-with-chart',
  templateUrl: './tile-preview-chart-with-calendar.component.html',
  styleUrls: [ './tile-preview-chart-with-calendar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartWithCalendarComponent implements OnInit {
  @Input() model: TilePreviewChartWithCalendar;
  selectedDate: any;

  constructor(public clientSettingsStore: Store<fromClientSettingsReducer.State>,
              private tileGridStore: Store<fromTileGridReducer.State>,
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
    if (this.model.ComponentData.TileMiddlePart) {
      this.selectedDate = new Date(this.model.ComponentData.TileMiddlePart.SelectedDate);
    }
  }

  datePickerValueChanged() {
    const clientSettingRequest = {
      FeatureArea: 'Dashboard', SettingName: 'JobsTileEffectiveDate',
      SettingValue:  this.selectedDate
    } as ClientSettingRequestModel;

    this.clientSettingsStore.dispatch(new fromClientSettingActions.SavingClientSetting
    (JSON.stringify(clientSettingRequest)));

    const actionSubjectSubscription = this.actionsSubject.filter(action => action.type === SAVING_CLIENT_SETTING_SUCCESS)
      .subscribe(() => {
          this.reloadTile();
          actionSubjectSubscription.unsubscribe();
        }
      );
  }

  reloadTile() {
    this.tileGridStore.dispatch(new fromTileGridActions.LoadingSingleTile(this.model.TileId));
  }
}

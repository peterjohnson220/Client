import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';


import 'hammerjs';

import { TilePreviewChart } from '../../../models';

import * as fromClientSettingsReducer from 'libs/core/reducers/client-settings.reducer';


import { Action, Store } from '@ngrx/store';

import * as fromClientSettingActions from 'libs/core/actions/client-settings.actions';
import { ClientSettingRequestModel } from '../../../../../../../../libs/models/common/client-setting-request.model';
import * as fromTileGridReducer from '../../../reducers';
import * as fromTileGridActions from '../../../actions/tile-grid.actions';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as fromClientSettingsActions from '../../../../../../../../libs/core/actions/client-settings.actions';
import { Actions } from '@ngrx/effects';
import { TilePreviewChartWithCalendar } from '../../../models/tile-preview-chart-with-calendar.model';


@Component({
  selector: 'pf-tile-preview-calendar-with-chart',
  templateUrl: './tile-preview-chart-with-calendar.component.html',
  styleUrls: [ './tile-preview-chart-with-calendar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartWithCalendarComponent implements OnInit {
  @Input() model: TilePreviewChartWithCalendar;
  selectedPricingEffectiveDate: any;
  clientSetting$: Observable<any>;

  constructor(private clientSettingsStore: Store<fromClientSettingsReducer.State>,
              private tileGridStore: Store<fromTileGridReducer.State>, private actions$: Actions) {
  }


  public chartData: any[] = [];

  showChartDetail = false;

  private legendlabelStyle: any = {
    padding: 3,
    font: 'bold 1rem',
    color: '#fff'
  };

  private seriesItemHighlightStyle: any = {
    opacity: 1,
    color: '#fff',
    border: '#000'
  };

  ngOnInit() {
    this.selectedPricingEffectiveDate = new Date(2000, 2, 10);

// may be able to disable typing into the element by doing this: document.getElementsByTagName("KendoDatePicker")

  }

  datePickerValueChanged() {
    const clientSettingRequest = {
      FeatureArea: 'Dashboard', SettingName: 'JobsTileEffectiveDate',
      SettingValue: this.selectedPricingEffectiveDate
    } as ClientSettingRequestModel;

    this.clientSettingsStore.dispatch(new fromClientSettingActions.SavingClientSetting
    (JSON.stringify(clientSettingRequest)));

    this.tileGridStore.dispatch(new fromTileGridActions.LoadingSingleTile(this.model.TileId));

  }
}

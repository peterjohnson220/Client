import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { SaveUiPersistenceSettingRequest } from 'libs/models/common/save-ui-persistence-setting-request.model';
import { TilePreviewChartWithCalendar } from '../../../models';

import * as fromRootState from 'libs/state/state';
import * as fromFeatureReducer from '../../../reducers';
import * as fromTileGridActions from '../../../actions/tile-grid.actions';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';

@Component({
  selector: 'pf-tile-preview-calendar-with-chart',
  templateUrl: './tile-preview-chart-with-calendar.component.html',
  styleUrls: [ './tile-preview-chart-with-calendar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartWithCalendarComponent implements OnInit {

  @Input() model: TilePreviewChartWithCalendar;
  selectedDate: any;
  savingSetting$: Observable<boolean>;
  savingSettingSuccess$: Observable<boolean>;
  savingSettingName$: Observable<string>;
  savingSettingName: string;
  savingSettingSuccessSubscription: any;
  constructor(public store: Store<fromFeatureReducer.State>) {
    this.savingSetting$ = this.store.select(fromRootState.getUiPersistenceSettingsSaving);
    this.savingSettingSuccess$ = this.store.select(fromRootState.getUiPersistenceSettingsSavingSuccess);
    this.savingSettingName$ = this.store.select(fromRootState.getUiPersistenceLastAttemptedSaveSettingName);

    this.savingSettingName$.subscribe(name => {
      this.savingSettingName = name;
    });

    this.savingSettingSuccessSubscription = this.savingSettingSuccess$.subscribe(savingSettingSuccess => {
      if (savingSettingSuccess && this.savingSettingName === 'JobsTileEffectiveDate') {
       this.reloadTile();
      }
    });
  }

  public seriesItemHighlightStyle: any = {
    opacity: 1,
    color: '#585858',
    border: '#000'
  };

  ngOnInit(): void {
    if (this.model.ComponentData && this.model.ComponentData.TileMiddlePart) {
      this.selectedDate = new Date(this.model.ComponentData.TileMiddlePart.SelectedDate);
    }
  }

  datePickerValueChanged() {
    const saveUiPersistenceSettingRequest = {
      FeatureArea: 'Dashboard', SettingName: 'JobsTileEffectiveDate',
      SettingValue: this.selectedDate
    } as SaveUiPersistenceSettingRequest;

    this.store.dispatch(new fromUiPersistenceSettingsActions.SavingUiPersistenceSetting
    (saveUiPersistenceSettingRequest));
  }

  reloadTile() {
    if (this.model !== undefined) {
      this.savingSettingSuccessSubscription.unsubscribe();
      this.store.dispatch(new fromTileGridActions.LoadingSingleTile(this.model.TileId));
    }
  }
}

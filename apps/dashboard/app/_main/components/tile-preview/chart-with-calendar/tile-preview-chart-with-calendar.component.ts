import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SaveUiPersistenceSettingRequest, FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import * as fromRootState from 'libs/state/state';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';

import { TilePreviewChartWithCalendar } from '../../../models';
import * as fromFeatureReducer from '../../../reducers';
import * as fromTileGridActions from '../../../actions/tile-grid.actions';

@Component({
  selector: 'pf-tile-preview-calendar-with-chart',
  templateUrl: './tile-preview-chart-with-calendar.component.html',
  styleUrls: [ './tile-preview-chart-with-calendar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartWithCalendarComponent implements OnInit {
  @Input() model: TilePreviewChartWithCalendar;
  @Input() set payscaleBrandingFeatureFlag(value: boolean) {
    this.seriesItemHighlightStyle = {
      opacity: 1,
      color: value ? '#03394F' : '#585858',
      border: '#000'
    };
  }

  selectedDate: any;
  savingSetting$: Observable<boolean>;
  savingSettingSuccess$: Observable<boolean>;
  savingSettingName$: Observable<string>;
  savingSettingName: string;
  savingSettingSuccessSubscription: any;
  shouldGetPricingsBeforeEffectiveDate: boolean;
  seriesItemHighlightStyle: any;

  constructor(public store: Store<fromFeatureReducer.State>) {
    this.savingSetting$ = this.store.select(fromRootState.getUiPersistenceSettingsSaving);
    this.savingSettingSuccess$ = this.store.select(fromRootState.getUiPersistenceSettingsSavingSuccess);
    this.savingSettingName$ = this.store.select(fromRootState.getUiPersistenceLastAttemptedSaveSettingName);

    this.savingSettingName$.subscribe(name => {
      this.savingSettingName = name;
    });

    this.savingSettingSuccessSubscription = this.savingSettingSuccess$.subscribe(savingSettingSuccess => {
      if (savingSettingSuccess && (this.savingSettingName === 'JobsTileEffectiveDate' ||
        this.savingSettingName === 'JobsTileShouldGetPricingsBeforeEffectiveDate')) {
       this.reloadTile();
      }
    });
  }

  ngOnInit(): void {
    if (this.model.ComponentData && this.model.ComponentData.TileMiddlePart) {
      this.selectedDate = new Date(this.model.ComponentData.TileMiddlePart.SelectedDate);
      this.shouldGetPricingsBeforeEffectiveDate = this.model.ComponentData.TileMiddlePart.ShouldGetBeforeSelectedDate;
    }
  }

  datePickerValueChanged() {
    const saveUiPersistenceSettingRequest = {
      FeatureArea: FeatureAreaConstants.Dashboard, SettingName: UiPersistenceSettingConstants.JobsTileEffectiveDate,
      SettingValue: this.selectedDate
    } as SaveUiPersistenceSettingRequest;

    this.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting
    (saveUiPersistenceSettingRequest));
  }

  reloadTile() {
    if (this.model !== undefined) {
      this.savingSettingSuccessSubscription.unsubscribe();
      this.store.dispatch(new fromTileGridActions.LoadingSingleTile(this.model.TileId));
    }
  }

  setShouldGetPricingsBeforeEffectiveDate(settingValue) {
    this.shouldGetPricingsBeforeEffectiveDate = settingValue;

    const saveUiPersistenceSettingRequest = {
      FeatureArea: FeatureAreaConstants.Dashboard,
      SettingName: UiPersistenceSettingConstants.JobsTileShouldGetPricingsBeforeEffectiveDate,
      SettingValue: this.shouldGetPricingsBeforeEffectiveDate.toString()
    } as SaveUiPersistenceSettingRequest;

    this.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting
    (saveUiPersistenceSettingRequest));
  }
}

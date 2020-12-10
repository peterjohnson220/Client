import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api/settings';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromUiPersistenceSettingsAction from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import * as fromRootState from 'libs/state/state';

@Component({
  selector: 'pf-marketing-preferences',
  templateUrl: './marketing-preferences.component.html',
  styleUrls: ['../communication-preferences.component.scss']
})
export class MarketingPreferencesComponent implements OnInit {
  hideMarketingTile$: Observable<boolean>;
  hideMarketingTile: boolean;
  savingSetting$: Observable<boolean>;
  savingSettingSuccess$: Observable<boolean>;
  savingSettingError$: Observable<boolean>;
  savingSettingsSuccess: boolean;
  savingSettingsError: boolean;
  savingSettingsSuccessSubscription: Subscription;
  savingSettingsErrorSubscription: Subscription;
  dirty: boolean;

  constructor(
    public store: Store<any>,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService,
    private settingsService: SettingsService
  ) {
    this.hideMarketingTile$ = this.settingsService.selectUiPersistenceSetting<boolean>(
      FeatureAreaConstants.Dashboard, UiPersistenceSettingConstants.HideMarketingTiles, 'boolean');
    this.savingSetting$ = this.store.select(fromRootState.getUiPersistenceSettingsSaving);
    this.savingSettingSuccess$ = this.store.select(fromRootState.getUiPersistenceSettingsSavingSuccess);
    this.savingSettingError$ = this.store.select(fromRootState.getUiPersistenceSettingsSavingError);
  }

  ngOnInit(): void {
    this.hideMarketingTile$.subscribe(x => {
      this.hideMarketingTile = x;
    });
    this.dirty = false;

    this.savingSettingsSuccessSubscription = this.savingSettingSuccess$.subscribe(x => {
      this.savingSettingsSuccess = x;
    });

    this.savingSettingsErrorSubscription = this.savingSettingError$.subscribe( x => {
      this.savingSettingsError = x;
    });
  }

  handleSaveClicked() {
    this.settingsService.updateUiPersistenceSettingValue(
      FeatureAreaConstants.Dashboard, UiPersistenceSettingConstants.HideMarketingTiles, this.hideMarketingTile.toString()
    );

    this.store.dispatch(new fromUiPersistenceSettingsAction.SaveUiPersistenceSetting(
      {
        FeatureArea: FeatureAreaConstants.Dashboard,
        SettingName: UiPersistenceSettingConstants.HideMarketingTiles,
        SettingValue: this.hideMarketingTile.toString()
      }
    ));

    this.dirty = false;
  }

  onMarketingPreferencesChange() {
    this.hideMarketingTile = !this.hideMarketingTile;
    this.dirty = !this.dirty;
    this.savingSettingsSuccess = false;
    this.savingSettingsError = false;
  }
}

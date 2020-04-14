import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { CompanySetting, CompanySettingsEnum, GenericNameValueDto, UiPersistenceFeatureSettingsModel } from 'libs/models';

@Injectable()
export class SettingsService {
  companySettings$: Observable<CompanySetting[]>;
  uiPersistenceSettings$: Observable<UiPersistenceFeatureSettingsModel[]>;
  uiPersistenceSettingsLoading$: Observable<boolean>;

  constructor(private store: Store<fromRootState.State>) {
    this.companySettings$ = this.store.pipe(select(fromRootState.getCompanySettings));
    this.uiPersistenceSettings$ = this.store.pipe(select(fromRootState.getUiPersistenceSettings));
    this.uiPersistenceSettingsLoading$ = this.store.pipe(select(fromRootState.getUiPersistenceSettingsLoading));
  }

  selectUiPersistenceFeatureSettings(featureName: string): Observable<GenericNameValueDto[]> {
    return this.uiPersistenceSettings$.pipe(map(features => {
      if (features) {
        const featureSettingsModel = features.find(f => f.FeatureName === featureName);
        return !!featureSettingsModel ? featureSettingsModel.Settings.map(s => {
          return {Name: s.Key, Value: s.Value};
        }) : [];
      }
    }));
  }

  selectUiPersistenceSetting<TValueType>(
    featureName: string,
    settingName: string,
    type: 'boolean'|'number'|'string' = 'boolean'
  ): Observable<TValueType> {
    return combineLatest([this.uiPersistenceSettings$, this.uiPersistenceSettingsLoading$]).pipe(
      filter(([settings, loading]) => !loading),
      map(([settings, loading]) => {
        if (!settings) {
          return null;
        }
        const featureSettingsModel = settings.find(cs => cs.FeatureName === featureName);
        if (!featureSettingsModel) {
          return null;
        }
        const setting = featureSettingsModel.Settings.find(fs => fs.Key === settingName);
        if (!setting) {
          return null;
        }

        return this.getSettingValue<TValueType>(setting.Value, type);
    }));
  }

  selectCompanySetting<TValueType>(
    companySettingEnum: CompanySettingsEnum,
    type: 'boolean'|'number'|'string' = 'boolean'
  ): Observable<TValueType> {
    return this.companySettings$.pipe(map(settings => {
      if (!settings) {
        return null;
      }
      const setting = settings.find(cs => cs.Key === companySettingEnum);
      if (!setting) {
        return null;
      }

      return this.getSettingValue<TValueType>(setting.Value, type);
    }));
  }

  getSettingValue<T>(value: string, type: string): T {
    let result: any;
    switch (type) {
      case 'boolean':
        result = value === 'true';
        break;
      case 'number':
        result = parseInt(value, null);
        break;
      default:
        result = value;
        break;
    }
    return result as T;
  }
}

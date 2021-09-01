import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import {
  CompanySetting,
  CompanySettingsEnum,
  LegacyCompanySettingDto,
  GenericNameValueDto,
  UiPersistenceFeatureSettingsModel
} from 'libs/models';
import * as fromUiPersistenceSettingsActions from '../actions/ui-persistence-settings.actions';

@Injectable()
export class SettingsService {
  companySettings$: Observable<CompanySetting[]>;
  companySettingsLoading$: Observable<boolean>;
  legacyCompanySettings$: Observable<LegacyCompanySettingDto[]>;
  legacyCompanySettingsLoading$: Observable<boolean>;
  uiPersistenceSettings$: Observable<UiPersistenceFeatureSettingsModel[]>;
  uiPersistenceSettingsLoading$: Observable<boolean>;

  constructor(private store: Store<fromRootState.State>) {
    this.companySettings$ = this.store.pipe(select(fromRootState.getCompanySettings));
    this.companySettingsLoading$ = this.store.pipe(select(fromRootState.getCompanySettingsLoading));
    this.legacyCompanySettings$ = this.store.pipe(select(fromRootState.getLegacyCompanySettings));
    this.legacyCompanySettingsLoading$ = this.store.pipe(select(fromRootState.getGettingLegacyCompanySettings));
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

  selectUiPersistenceSettingFromDictionary<TValue>(featureName: string, settingName: string, key: string | number): Observable<TValue> {
    const dictionary$ = this.selectUiPersistenceSetting<{ [dictionaryKey: string]: TValue}>(featureName, settingName, 'json');

    return dictionary$.pipe(map(dictionary => !!dictionary && !!key ? dictionary[key.toString()] : null));
  }

  selectUiPersistenceSettingDictionary<TValue>(featureName: string, settingName: string): Observable<{ [dictionaryKey: string]: TValue}> {
    return this.selectUiPersistenceSetting<{ [dictionaryKey: string]: TValue}>(featureName, settingName, 'json');
  }

  updateUiPersistenceSettingDictionary<TValue>(featureName: string, settingName: string, key: string|number, value: TValue) {
    const dictionary$ = this.selectUiPersistenceSetting<{ [dictionaryKey: string]: TValue}>(featureName, settingName, 'json');

    dictionary$.pipe(take(1)).subscribe((dictionary) => {
      const newDictionary = {
        ...dictionary,
        [key]: value
      };
      this.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
          FeatureArea: featureName,
          SettingName: settingName,
          SettingValue: JSON.stringify(newDictionary)
        }));
    });
  }

  updateUiPersistenceSettingValue<TValue>(featureName: string, settingName: string, value: string) {
    const dictionary$ = this.selectUiPersistenceSetting<{ [dictionaryKey: string]: TValue}>(featureName, settingName, 'json');

    dictionary$.pipe(take(1)).subscribe((dictionary) => {
      this.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
        FeatureArea: featureName,
        SettingName: settingName,
        SettingValue: value
      }));
    });
  }

  selectUiPersistenceSetting<TValueType>(
    featureName: string,
    settingName: string,
    type: 'boolean'|'number'|'string'|'json' = 'boolean'
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
    return combineLatest([this.companySettings$, this.companySettingsLoading$]).pipe(
      filter(([settings, loading]) => !loading),
      map(([settings, loading]) => {
        if (!settings) {
          return null;
        }
        const setting = settings.find(cs => cs.Key === companySettingEnum);
        if (!setting) {
          return null;
        }

        return this.getSettingValue<TValueType>(setting.Value, type);
      })
    );
  }

  selectLegacyCompanySetting<TValueType>(
    companySettingEnum: CompanySettingsEnum,
    type: 'boolean'|'number'|'string' = 'boolean'
  ): Observable<TValueType> {
    return combineLatest([this.legacyCompanySettings$, this.legacyCompanySettingsLoading$]).pipe(
      filter(([settings, loading]) => !loading),
      map(([settings, loading]) => {
        if (!settings) {
          return null;
        }
        const setting = settings.find(cs => cs.Name === companySettingEnum);
        if (!setting) {
          return null;
        }

        return this.getSettingValue<TValueType>(setting.Value.toLowerCase(), type);
      })
    );
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
      case 'json':
        try {
          result = JSON.parse(value);
        } catch (e) {
          result = null;
        }

        break;
      default:
        result = value;
        break;
    }
    return result as T;
  }
}

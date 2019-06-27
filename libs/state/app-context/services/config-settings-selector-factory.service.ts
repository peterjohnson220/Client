import { Injectable } from '@angular/core';
import { createSelector } from '@ngrx/store';
import { getUserContext } from '../../state';

@Injectable()
export class ConfigSettingsSelectorFactory {
  getConfigSettingsSelector(key: string) {
    return createSelector(getUserContext, this.createSelector(key));
  }

  private createSelector(key: string): (state) => any {
    return (state) => state.ConfigSettings.find(x => x.Name === key);
  }
}

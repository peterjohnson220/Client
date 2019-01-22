import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import {
  LegacyCompanySettingsEffects, UserContextEffects, UiPersistenceSettingsEffects, UserAssignedRoleEffects,
  CompanyContextEffects, CompanySettingsEffects
} from './app-context/effects';
import { reducers, metaReducers } from './state';
import { environment } from '../../environments/environment';
import { SettingsService } from './app-context/services';

@NgModule({
  imports: [
    // Store Module
    StoreModule.forRoot(reducers, { metaReducers }),

    // Effects
    EffectsModule.forRoot([
      UserContextEffects, LegacyCompanySettingsEffects, UiPersistenceSettingsEffects,
      UserAssignedRoleEffects, CompanyContextEffects, CompanySettingsEffects
    ]),

    // Dev Tools
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [SettingsService]
})
export class PfStateModule {}

import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import {
    CompanyContextEffects, CompanySettingsEffects, LegacyCompanySettingsEffects, UiPersistenceSettingsEffects, UserAssignedRoleEffects,
    UserContextEffects
} from './app-context/effects';
import { metaReducers, reducers } from './state';
import { environment } from '../../environments/environment';
import { SettingsService } from './app-context/services';

@NgModule({
  imports: [
    // Store Module
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),

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
export class PfStateModule { }

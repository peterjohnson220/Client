import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CompanySettingsEffects, UserContextEffects } from './app-context/effects';
import { reducers, metaReducers } from './state';
import { environment } from '../../environments/environment';


@NgModule({
  imports: [
    // Store Module
    StoreModule.forRoot(reducers, { metaReducers }),

    // Effects
    EffectsModule.forRoot([UserContextEffects, CompanySettingsEffects]),

    // Dev Tools
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ]
})
export class PfStateModule {}

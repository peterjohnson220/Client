import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { LayoutWrapperModule } from '../../../../libs/ui/layout-wrapper';
import { IdentityEffects } from '../../../../libs/security/app-context/effects';
import { environment } from '../environments/environment';
import { PayfactorsApiModule } from '../../../../libs/data/payfactors-api';

import { AppComponent } from './app.component';
import { reducers, metaReducers } from './reducers';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LayoutWrapperModule,
    PayfactorsApiModule,

    StoreModule.forRoot(reducers, { metaReducers }),

    !environment.production ? StoreDevtoolsModule.instrument() : [],

    EffectsModule.forRoot([IdentityEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SsoConfigEffects } from './effects';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { SsoConfigPageComponent } from './containers/pages/sso-config';
import { reducers } from './reducers';
import { SsoRoutingModule } from './sso-routing.module';
import { PfCommonUIModule } from 'libs/ui/common';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,


    DropDownsModule,
    StoreModule.forFeature('sso', reducers),
    EffectsModule.forFeature([SsoConfigEffects]),
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // Routing
    SsoRoutingModule
  ],
  declarations: [
    SsoConfigPageComponent
  ],
  providers: []
})
export class SsoModule {}

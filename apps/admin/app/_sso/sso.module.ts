import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SsoConfigEffects } from './effects';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { UploadModule } from '@progress/kendo-angular-upload';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector/company-selector.module';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import { SsoConfigPageComponent } from './containers/pages/sso-config';
import { reducers } from './reducers';
import { SsoRoutingModule } from './sso-routing.module';
import { SsoGridComponent } from './containers/sso-grid';
import { SsoConfigModalComponent } from './containers/sso-config-modal';

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
    UploadModule,
    GridModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCompanySelectorModule,

    // Routing
    SsoRoutingModule
  ],
  declarations: [
    SsoConfigPageComponent,
    SsoGridComponent,
    SsoConfigModalComponent,
  ],
  providers: []
})
export class SsoModule {}

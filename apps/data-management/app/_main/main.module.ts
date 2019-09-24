import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { reducers } from './reducers';
import {
  DataAlertsPageComponent, DataManagementHomePageComponent,
  DataManagementSidebarComponent,
  HrisAuthenticationCardComponent,
  ManageDataPageComponent,
  ProviderCardComponent,
  TransferDataPageComponent,
  TransferMethodDropdownComponent,
  WorkdayAuthenticationComponent,
  PfTestAuthenticationComponent
} from './containers';
import { TransferDataPageEffects } from './effects';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Routing
    MainRoutingModule,

    // 3rd Party
    StoreModule.forFeature('data_management', reducers),
    EffectsModule.forFeature([
      TransferDataPageEffects
    ]),

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    DataManagementHomePageComponent,
    TransferDataPageComponent,
    ManageDataPageComponent,
    DataAlertsPageComponent,

    // Components
    DataManagementSidebarComponent,
    TransferMethodDropdownComponent,
    ProviderCardComponent,
    HrisAuthenticationCardComponent,
    WorkdayAuthenticationComponent,
    PfTestAuthenticationComponent
  ]
})
export class MainModule { }

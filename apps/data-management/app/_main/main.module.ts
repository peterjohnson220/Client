import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { reducers } from './reducers';
import {
  DataAlertsPageComponent, DataManagementHomePageComponent,
  DataManagementSidebarComponent,
  ManageDataPageComponent,
  ProviderCardComponent,
  TransferDataPageComponent,
  TransferMethodDropdownComponent
} from './containers';
import { TransferDataPageEffects } from './effects';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

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

    // Components
    DataManagementSidebarComponent,
    TransferDataPageComponent,
    ManageDataPageComponent,
    DataAlertsPageComponent,
    TransferMethodDropdownComponent,
    ProviderCardComponent
  ]
})
export class MainModule { }

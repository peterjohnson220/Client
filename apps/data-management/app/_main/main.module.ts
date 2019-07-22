import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import {
    DataAlertsPageComponent, DataManagementHomePageComponent, DataManagementSidebarComponent, ManageDataPageComponent,
    TransferDataPageComponent
} from './containers';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    MainRoutingModule,

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
    DataAlertsPageComponent
  ]
})
export class MainModule { }









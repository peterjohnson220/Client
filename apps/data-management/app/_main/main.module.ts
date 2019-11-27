import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadModule } from '@progress/kendo-angular-upload';

import { PfCommonModule } from 'libs/core';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector.module';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import {
    DataAlertsPageComponent, DataManagementHomePageComponent, DataManagementSidebarComponent, HrisAuthenticationCardComponent,
    ManageDataPageComponent, OrgDataLoadComponent, PfTestAuthenticationComponent, ProviderCardComponent, TransferDataPageComponent,
    TransferMethodDropdownComponent, WorkdayAuthenticationComponent
} from './containers';
import { TransferDataPageEffects } from './effects';
import { MainRoutingModule } from './main-routing.module';
import { EntityPickerComponent, EntityUploadComponent } from './components/';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Routing
    MainRoutingModule,

    // 3rd Party
    StoreModule.forFeature('data_management', reducers),
    EffectsModule.forFeature([
      TransferDataPageEffects,
    ]),
    FontAwesomeModule,
    NgbTooltipModule,
    UploadModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCompanySelectorModule
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
    PfTestAuthenticationComponent,
    OrgDataLoadComponent,
    EntityPickerComponent,
    EntityUploadComponent
  ]
})
export class MainModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}

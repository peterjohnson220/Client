import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DragulaModule } from 'ng2-dragula';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadModule } from '@progress/kendo-angular-upload';

import { PfCommonModule } from 'libs/core';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector.module';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { EntityPickerComponent, EntityUploadComponent } from './components';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import {
  DataAlertsPageComponent, DataManagementHomePageComponent, DataManagementSidebarComponent, FieldMappingCardComponent,
  HrisAuthenticationCardComponent, ManageDataPageComponent, OrgDataLoadComponent, PfTestAuthenticationComponent, ProviderCardComponent,
  TransferDataPageComponent, TransferMethodDropdownComponent, WorkdayAuthenticationComponent, EntityMappingComponent
} from './containers';
import { OrganizationalDataPageEffects, TransferDataPageEffects, FieldMappingEffects } from './effects';
import * as fromFaIcons from './fa-icons';
import { MainRoutingModule } from './main-routing.module';
import { reducers } from './reducers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Routing
    MainRoutingModule,

    // 3rd Party
    // DragulaModule.forRoot(),
    StoreModule.forFeature('data_management', reducers),
    EffectsModule.forFeature([
      TransferDataPageEffects,
      OrganizationalDataPageEffects,
      FieldMappingEffects
    ]),
    FontAwesomeModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbAlertModule,
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
    EntityUploadComponent,
    FieldMappingCardComponent,
    FileUploadComponent,
    EntityMappingComponent
  ]
})
export class MainModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}

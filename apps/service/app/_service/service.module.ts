import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadModule } from '@progress/kendo-angular-upload';
import { QuillModule } from 'ngx-quill';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { ServicePageEffects } from './effects';
import { ServicePageComponent } from './service.page';
import { CreateTicketModalComponent } from './containers';
import { ServiceRoutingModule } from './service-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Routing
    ServiceRoutingModule,

    // 3rd party
    StoreModule.forFeature('service_main', reducers),
    EffectsModule.forFeature([
      ServicePageEffects
    ]),
    FontAwesomeModule,
    DropDownsModule,
    SwitchModule,
    NgbPopoverModule,
    UploadModule,
    QuillModule.forRoot(),

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule
  ],
  declarations: [
    // Pages
    ServicePageComponent,

    // Containers
    CreateTicketModalComponent
  ],
  providers: [
    { provide: 'DataViewService', useClass: DataViewApiService }
  ]
})
export class ServiceModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}

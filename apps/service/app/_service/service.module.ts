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
import { ImgFallbackModule } from 'ngx-img-fallback';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import { PfCommentBoxModule } from 'libs/features/comment-box/';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { ServicePageEffects, TicketNotesEffects } from './effects';
import { ServicePageComponent } from './service.page';
import { CreateTicketModalComponent, GridActionsComponent, TicketNotesComponent } from './containers';
import {
  ServiceDashboardComponent, SupportTeamComponent, TicketsDetailsComponent, TicketAttachmentsComponent
} from './components';
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
      ServicePageEffects,
      TicketNotesEffects
    ]),
    FontAwesomeModule,
    DropDownsModule,
    SwitchModule,
    NgbPopoverModule,
    UploadModule,
    QuillModule.forRoot(),
    ImgFallbackModule,
    PerfectScrollbarModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule,
    PfCommentBoxModule
  ],
  declarations: [
    // Pages
    ServicePageComponent,

    // Containers
    CreateTicketModalComponent,
    GridActionsComponent,
    TicketNotesComponent,

    // Components
    ServiceDashboardComponent,
    SupportTeamComponent,
    TicketsDetailsComponent,
    TicketAttachmentsComponent
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

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { WindowRef } from 'libs/core/services';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { TicketDetailCardComponent } from './components';
import {
    AttachmentDeleteModalComponent, AttachmentDetailCardComponent, CompanyDetailCardComponent, TicketComponent, TicketFieldsComponent,
    TicketListComponent, TicketListPageComponent
} from './containers';
import { TicketAttachmentEffects, TicketEffects, TicketListEffects, TicketLookupEffects } from './effects';
import { reducers } from './reducers';
import { TicketsRoutingModule } from './tickets-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('admin_tickets', reducers),
    EffectsModule.forFeature([
      TicketEffects,
      TicketListEffects,
      TicketLookupEffects,
      TicketAttachmentEffects
    ]),
    GridModule,
    LayoutModule,
    ComboBoxModule,
    NgbTabsetModule,

    // Routing
    TicketsRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    AttachmentDetailCardComponent,
    CompanyDetailCardComponent,
    TicketDetailCardComponent,

    // Containers
    TicketListComponent,
    TicketComponent,
    TicketFieldsComponent,
    AttachmentDeleteModalComponent,

    // Pages
    TicketListPageComponent,
  ],
  providers: [
    WindowRef
  ]
})
export class TicketsModule { }

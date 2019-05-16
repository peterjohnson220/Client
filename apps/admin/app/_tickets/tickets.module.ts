import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { WindowRef } from 'libs/core/services';
import { PfCommonUIModule } from 'libs/ui/common';

import {
  TicketListComponent, TicketListPageComponent, CompanyDetailCardComponent,
  TicketComponent, TicketFieldsComponent, AttachmentDetailCardComponent
} from './containers';
import {TicketEffects, TicketListEffects, TicketLookupEffects} from './effects';
import { reducers } from './reducers';
import { TicketDetailCardComponent } from './components';
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
      TicketLookupEffects
    ]),
    GridModule,
    LayoutModule,
    ComboBoxModule,
    NgbTabsetModule,

    // Routing
    TicketsRoutingModule,

    // Payfactors
    PfCommonUIModule
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

    // Pages
    TicketListPageComponent,
  ],
  providers: [
    WindowRef
  ]
})
export class TicketsModule { }

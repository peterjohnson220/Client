import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { WindowRef } from 'libs/core/services';
import { PfCommonUIModule } from 'libs/ui/common';

import { TicketListComponent, TicketListPageComponent } from './containers';
import { TicketEffects, TicketListEffects } from './effects';
import { reducers } from './reducers';
import { TicketComponent } from './containers/ticket';
import { CompanyDetailCardComponent, TicketDetailCardComponent } from './components';
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
    ]),
    GridModule,
    LayoutModule,
    NgbTabsetModule,

    // Routing
    TicketsRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Components
    CompanyDetailCardComponent,
    TicketDetailCardComponent,

    // Containers
    TicketListComponent,
    TicketComponent,

    // Pages
    TicketListPageComponent,
  ],
  providers: [
    WindowRef
  ]
})
export class TicketsModule { }

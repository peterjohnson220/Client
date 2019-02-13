import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsRoutingModule } from './tickets-routing.module';
import { PfCommonUIModule } from 'libs/ui/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketListComponent } from './containers/ticket-list';

@NgModule({
  imports: [
    CommonModule,
    PfCommonUIModule,
    FormsModule,
    ReactiveFormsModule,

    // Routing
    TicketsRoutingModule
  ],
  declarations: [
    // Containers
    TicketListComponent,
  ]
})
export class TicketsModule { }

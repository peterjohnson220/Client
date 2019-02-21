import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PfAdminGuard } from 'libs/security/guards';
import { TicketListComponent } from './containers/ticket-list';

const routes: Routes = [
  { path: 'ticket-list', component: TicketListComponent, canActivate: [PfAdminGuard] },
  { path: '', redirectTo: 'ticket-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }

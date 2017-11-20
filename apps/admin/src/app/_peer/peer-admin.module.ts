import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@progress/kendo-angular-grid';

import { PFCommonUIModule } from '../../../../../libs/ui/common';

import { ExchangeGridComponent } from './components';
import { ExchangeListPageComponent } from './containers/pages/';
import { PeerAdminRoutingModule } from './peer-admin-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    GridModule,

    // Routing
    PeerAdminRoutingModule,

    // Payfactors
    PFCommonUIModule
  ],
  declarations: [
    // Components
    ExchangeGridComponent,

    // Pages
    ExchangeListPageComponent
  ]
})
export class PeerAdminModule { }






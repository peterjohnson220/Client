import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfSharedModule } from 'libs/shared';

import { ExchangeListPageComponent } from './containers';
import { MainRoutingModule } from './main-routing.module';
import { PfCommonUIModule } from 'libs/ui/common';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfSharedModule
  ],
  declarations: [
    // Pages
    ExchangeListPageComponent
  ]
})
export class MainModule { }









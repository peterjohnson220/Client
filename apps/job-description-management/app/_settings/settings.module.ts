import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ViewsListModule } from './views-list';
import { LayoutModule } from './layout';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    SettingsRoutingModule,

    // Payfactors
    PfCommonUIModule,

    // Features
    ViewsListModule,
    LayoutModule,
  ]
})
export class SettingsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ViewsListModule } from './views-list';
import { ViewEditGuard, ViewEditModule } from './view-edit';
import { LayoutModule } from './layout';
import { FooterViewModule } from './footer-view';

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
    ViewEditModule,
    FooterViewModule
  ],
  providers: [
    ViewEditGuard
  ]
})
export class SettingsModule { }

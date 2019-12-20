import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';
import { SharedModule } from '../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { ViewsListModule } from './views-list';
import { ViewEditGuard, ViewEditModule } from './view-edit';
import { LayoutModule } from './layout';
import { FooterViewModule } from './footer-view';
import { CompanyControlsListModule } from './company-controls-list';
import { CompanyControlsDetailModule, CompanyControlsDetailViewGuard } from './company-controls-detail';
import { RoutingWorkflowsModule } from './routing-workflows';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    SettingsRoutingModule,

    // Payfactors
    PfCommonUIModule,
    SharedModule,

    // Features
    ViewsListModule,
    LayoutModule,
    ViewEditModule,
    FooterViewModule,
    CompanyControlsListModule,
    CompanyControlsDetailModule,
    RoutingWorkflowsModule
  ],
  providers: [
    ViewEditGuard,
    CompanyControlsDetailViewGuard
  ]
})
export class SettingsModule { }

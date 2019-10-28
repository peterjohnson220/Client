import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { JobDescriptionViewsListModule } from './job-description-views-list';
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
    JobDescriptionViewsListModule,
    LayoutModule,
  ]
})
export class SettingsModule { }

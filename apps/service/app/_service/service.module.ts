import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { ServicePageComponent } from './service.page';
import { ServiceRoutingModule } from './service-routing.module';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    ServiceRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    ServicePageComponent
  ]
})
export class ServiceModule { }

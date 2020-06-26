import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ECommerceRoutingModule } from './ecommerce-routing.module';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    ECommerceRoutingModule
  ],
  declarations: []
})
export class ECommerceModule { }

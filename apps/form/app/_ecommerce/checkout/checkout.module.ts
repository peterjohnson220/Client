import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ECommerceModule } from 'libs/features/ecommerce';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutPageComponent } from './checkout.page';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // Payfactors
    ECommerceModule,

    // Routing
    CheckoutRoutingModule
  ],
  declarations: [
    CheckoutPageComponent
  ]
})
export class CheckoutModule { }

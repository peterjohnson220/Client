import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducers';
import { ECommerceService } from './services';
import { ECommerceEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('feature_ecommerce', reducers),
    EffectsModule.forFeature([ECommerceEffects])
  ],
  providers: [
    ECommerceService
  ]
})
export class ECommerceModule { }

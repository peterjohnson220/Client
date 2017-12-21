import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfSharedModule } from 'libs/shared';

import { ExchangeListPageComponent } from './containers';
import { MainRoutingModule } from './main-routing.module';
import { PfCommonUIModule } from 'libs/ui/common';
import { EffectsModule } from '@ngrx/effects';
import { ExchangeListEffects } from './effects';



@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party
    EffectsModule.forFeature([ExchangeListEffects]),

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









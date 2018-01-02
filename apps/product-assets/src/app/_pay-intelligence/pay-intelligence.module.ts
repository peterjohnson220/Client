import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PfCommonUIModule } from 'libs/ui/common';

import { PayIntelligencePageComponent, ProductAssetsListComponent } from './containers';
import { ProductAssetsListEffects } from './effects';
import { PayIntelligenceRoutingModule } from './pay-intelligence-routing.module';
import { reducers } from './reducers';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    // GridModule,
    StoreModule.forFeature('productAssets', reducers),
    EffectsModule.forFeature([ProductAssetsListEffects]),

    // Routing
    PayIntelligenceRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Pages
    PayIntelligencePageComponent,

    // Components
    ProductAssetsListComponent
  ]
})
export class PayIntelligenceModule { }

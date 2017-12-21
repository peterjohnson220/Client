import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';

import { ProductAssetsPageComponent } from './containers';
import { CompInfluencersRoutingModule } from './comp-influencers-routing.module';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    CompInfluencersRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Pages
    ProductAssetsPageComponent
  ]
})
export class CompInfluencersModule { }









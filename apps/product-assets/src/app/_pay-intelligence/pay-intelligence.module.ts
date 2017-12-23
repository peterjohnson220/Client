import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';

import { PayIntelligencePageComponent } from './containers';
import { PayIntelligenceRoutingModule } from './pay-intelligence-routing.module';

import { ProductAssetsListComponent} from './components';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { StoreModule } from '@ngrx/store';
import { ProductAssetsListEffects } from './effects';


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









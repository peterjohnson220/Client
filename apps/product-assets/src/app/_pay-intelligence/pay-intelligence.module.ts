import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PfFormsModule } from 'libs/forms';

import { PfCommonUIModule } from 'libs/ui/common';

import { TableauReportEmbedComponent} from './components';
import { PayIntelligencePageComponent, ProductAssetsListComponent, TableauReportPageComponent } from './containers';
import { ProductAssetsListEffects } from './effects';
import { PayIntelligenceRoutingModule } from './pay-intelligence-routing.module';
import { reducers } from './reducers';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    // GridModule,
    StoreModule.forFeature('productAssets', reducers),
    EffectsModule.forFeature([ProductAssetsListEffects]),

    // Routing
    PayIntelligenceRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    PayIntelligencePageComponent,
    TableauReportPageComponent,

    // Components
    ProductAssetsListComponent,

    // Containers
    TableauReportEmbedComponent
  ]
})
export class PayIntelligenceModule { }

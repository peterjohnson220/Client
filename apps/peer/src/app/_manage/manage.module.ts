import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfKendoExtensions } from 'libs/extensions';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfPeerFeaturesModule } from 'libs/features';
import { PfCommonModule } from 'libs/core';

import { CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent } from './components';
import { ExchangeJobMappingPageComponent, ExchangeJobMappingInfoComponent, ExchangeJobMappingGridComponent,
         PayfactorsJobModalComponent } from './containers';
import { ExchangeJobMappingGridEffects, ExchangeJobMappingInfoEffects, PayfactorsJobExchangeRequestEffects } from './effects';
import { reducers } from './reducers';
import { ExchangeJobMappingService, } from './services';
import { ManageRoutingModule } from './manage-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd party
    GridModule,
    StoreModule.forFeature('peerManagement', reducers),
    EffectsModule.forFeature([
      ExchangeJobMappingGridEffects, ExchangeJobMappingInfoEffects, PayfactorsJobExchangeRequestEffects
    ]),
    DropDownsModule,

    // Routing
    ManageRoutingModule,

    // Payfactors
    SharedModule,
    PfCommonUIModule,
    PfPeerFeaturesModule,
    PfFormsModule,
    PfKendoExtensions,
    PfCommonModule
  ],
  declarations: [
    // Components
    CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent,

    // Containers
    ExchangeJobMappingGridComponent, ExchangeJobMappingInfoComponent, PayfactorsJobModalComponent,

    // Pages
    ExchangeJobMappingPageComponent
  ],
  providers: [
    ExchangeJobMappingService
  ]
})
export class ManageModule { }
